import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { RegularUser } from "../entities/RegularUser";
import { MyContext } from "../types";
import argon2, { hash } from "argon2";
import { AdminUser } from "../entities/AdminUser";
import { validateRegister } from "../utils/register";
import { COOKIE_NAME } from "../constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { datasource } from "..";
import { FindOptionsWhere, ObjectID } from "typeorm";
// @ts-ignore
import { ObjectId } from "mongodb";

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
  @Field(() => AdminUser, { nullable: true })
  user?: AdminUser;
}

@Resolver()
export class UserResolver {
  @Query(() => AdminUser, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<AdminUser | null> {
    console.log(req.session);
    if (!req.session.userId) {
      return null;
    }

    const user = await datasource.manager.findOneBy(AdminUser, {
      _id: new ObjectId(req.session.userId),
    } as any);
    if (user) {
      user._id = user?._id.toString();
    }

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("username", () => String) username: string,
    @Arg("password", () => String) password: string,
    @Ctx() { req }: MyContext
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
      return { user: user };
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
    @Ctx() { req }: MyContext
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

    return { user: user };
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
      `<a href="http://localhost:3000/create-password/${token}">Reset Password</a>`
    ).catch((err) => console.log(err));

    return true;
  }

  @Mutation(() => UserResponse)
  async forgotPassword(
    @Arg("newPassword", () => String) newPassword: string,
    @Arg("token", () => String) token: string,
    @Ctx() { req }: MyContext
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

    await datasource.manager.save(AdminUser);

    req.session.userId = user._id.toString();

    return { user: user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME as string);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}
