import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types";
import argon2 from "argon2";
import { AdminUser } from "../entities/AdminUser";
import { validateRegister } from "../utils/register";
import { _prod_ } from "../constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { datasource } from "..";
// @ts-ignore
import { ObjectId } from "mongodb";
import { isCustomer } from "../middleware/isCustomer";
import { isAdmin } from "../middleware/isAdmin";
import { RegularUser } from "../entities/RegularUser";

@ObjectType()
class RegularUserResponse {
  @Field(() => [RegularUser], { nullable: true })
  users?: RegularUser[];

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
class DeleteUser {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean, { nullable: true })
  success?: Boolean;
}

@ObjectType()
class FieldError {
  @Field(() => String)
  message!: string;
  @Field(() => String)
  field!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Boolean, { nullable: true })
  user?: Boolean;
}

@Resolver()
export class UserResolver {
  @Query(() => AdminUser, { nullable: true })
  async me(@Ctx() { req }: any): Promise<AdminUser | null> {
    if (!req.session.userId || !req.session.admin) {
      return null;
    }

    const user = await datasource.manager.findOneBy(AdminUser, {
      _id: new ObjectId(req.session.userId),
    } as any);

    if (!user) {
      return null;
    }
    if (user) {
      user._id = user?._id.toString();
    }

    return user;
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isAdmin)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("username", () => String) username: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req }: any
  ): Promise<UserResponse> {
    const response = validateRegister(email, username, password);

    if (response) {
      return { errors: response };
    }

    const hashedPassword = await argon2.hash(password);

    try {
      const user = new AdminUser();

      user.username = username;
      user.password = hashedPassword;
      user.email = email;
      await datasource.manager.save(user);
      req.session.userId = user._id.toString();
      return { user: true };
    } catch (err: any) {
      if (err.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "email",
              message: "User Already Exists",
            },
          ],
        };
      }
    }

    return { errors: [{ field: "Error", message: "Unknown Error" }] };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail", () => String) usernameOrEmail: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req }: any
  ): Promise<UserResponse> {
    const user = await datasource.manager.findOneBy(
      AdminUser,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "username or email doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    //store user id session
    //this will set a cookie on the user
    //keep them logged in

    req.session.userId = user._id.toString();
    req.session.admin = true;
    req.session.customer = false;
    req.session.employee = false;

    return { user: true };
  }

  @Mutation(() => Boolean)
  async sendEmail(@Arg("email", () => String) email: string): Promise<Boolean> {
    const user = await datasource.manager.findOneBy(AdminUser, {
      email: email,
    });

    if (!user) {
      return true;
    }

    const token = v4().toString();

    user.forgotpassword = token;

    await datasource.manager.save(user);

    await sendEmail(
      user.email,
      `<a href="http://${
        _prod_ ? ".planetearthlawncare.org" : "localhost:3000"
      }/create-password/${token}">Reset Password</a>`
    ).catch((err) => console.log(err));

    return true;
  }

  @Mutation(() => UserResponse)
  async forgotPassword(
    @Arg("newPassword", () => String) newPassword: string,
    @Arg("token", () => String) token: string,
    @Ctx() { req }: any
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const user = await datasource.manager.findOneBy(AdminUser, {
      forgotpassword: token,
    });

    if (!user) {
      return {
        errors: [
          {
            field: "User",
            message:
              "User not found. Please make sure you click the exact link you were sent in your email and try again.",
          },
        ],
      };
    }

    const password = await argon2.hash(newPassword);

    user.password = password;
    user.forgotpassword = null;

    await datasource.manager.save(user);

    req.session.userId = user._id.toString();

    req.session.admin = false;

    return { user: true };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: any): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err: any) => {
        res.clearCookie(process.env.COOKIENAME as string);
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(true);
      });
    });
  }

  @Query(() => RegularUserResponse)
  @UseMiddleware(isAdmin)
  async getUsers(@Ctx() { req }: any): Promise<RegularUserResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "authentication",
            message: "User not authenticated",
          },
        ],
      };
    }

    // if (!req.session.admin) {
    //   return {
    //     errors: [
    //       {
    //         field: "authorization",
    //         message: "User not authorized",
    //       },
    //     ],
    //   };
    // }
    return { users: await datasource.manager.find(RegularUser) };
  }

  @Mutation(() => DeleteUser)
  @UseMiddleware(isAdmin)
  async deleteUser(
    @Ctx() { req, res }: any,
    @Arg("id", () => String) id: string
  ): Promise<DeleteUser> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "authentication",
            message: "User not authenticated",
          },
        ],
      };
    }
    const user = await datasource.manager.delete(RegularUser, new ObjectId(id));

    return { success: true };
  }
}
