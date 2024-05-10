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
import { datasource } from "..";
import { RegularUser } from "../entities/RegularUser";
import { MyContext } from "../types";
// @ts-ignore
import { ObjectId } from "mongodb";
import { isCustomer } from "../middleware/isCustomer";
import argon2 from "argon2";
import { validateRegister } from "../utils/register";
import { sendEmail } from "../utils/sendEmail";
import { _prod_ } from "../constants";
import { v4 } from "uuid";

@ObjectType()
class regularUserStatusResponse {
  @Field(() => Boolean, { nullable: true })
  user?: Boolean;

  @Field(() => [SecondErrorResponse], { nullable: true })
  errors?: SecondErrorResponse[];
}

@ObjectType()
class SecondErrorResponse {
  @Field(() => String)
  field!: string;

  @Field(() => String)
  message!: string;
}

@Resolver()
export class RegularUserResolver {
  @Mutation(() => regularUserStatusResponse)
  async createUser(
    @Arg("name", () => String) name: string,
    @Arg("phoneNumber", () => String) phoneNumber: string,
    @Arg("address", () => String) address: string,
    @Arg("password", () => String) password: string,
    @Arg("email", () => String) email: string,
    @Ctx() { req }: any
  ): Promise<regularUserStatusResponse> {
    const response = validateRegister(email, name, password);

    if (response) {
      return { errors: response };
    }
    const newUser = new RegularUser();

    newUser.name = name;
    newUser.address = address;
    newUser.phoneNumber = phoneNumber;

    const hashedPassword = await argon2.hash(password);

    newUser.password = hashedPassword;
    newUser.email = email;

    try {
      let user = await datasource.manager.save(newUser);

      if (!req.session.admin) {
        req.session.userId = user._id.toString();
        req.session.admin = false;
        req.session.customer = true;
        req.session.employee = false;
      }
    } catch (error: any) {
      if (error?.code === 11000) {
        return {
          errors: [
            {
              field: "Duplicate Address or Phone Number or Email",
              message:
                "Someone else in this database already has this address, phone number, or email. Please make a new estimate under their name.",
            },
          ],
        };
      } else {
        return {
          errors: [
            {
              field: "Unkown Error",
              message: "An Unkown Error Occurred",
            },
          ],
        };
      }
    }

    return { user: true };
  }

  @Mutation(() => regularUserStatusResponse)
  async loginRegularUser(
    @Ctx() { req, res }: any,
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ): Promise<regularUserStatusResponse> {
    const user = await datasource.manager.findOneBy(RegularUser, {
      email: email,
    });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "email doesn't exist",
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
    req.session.admin = false;
    req.session.customer = true;
    req.session.employee = false;

    return { user: true };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isCustomer)
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

  @Query(() => RegularUser, { nullable: true })
  async getUser(@Ctx() { req }: any): Promise<RegularUser | null> {
    if (!req.session.userId || !req.session.customer) {
      return null;
    }

    const user = await datasource.manager.findOneBy(RegularUser, {
      _id: new ObjectId(req.session.userId),
    } as any);
    if (user) {
      user._id = user?._id.toString();
    }

    return user;
  }

  @Mutation(() => Boolean)
  async sendUserEmail(
    @Arg("email", () => String) email: string
  ): Promise<Boolean> {
    const user = await datasource.manager.findOneBy(RegularUser, {
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
    );

    return true;
  }

  @Mutation(() => regularUserStatusResponse)
  async forgotUserPassword(
    @Arg("newPassword", () => String) newPassword: string,
    @Arg("token", () => String) token: string,
    @Ctx() { req }: any
  ): Promise<regularUserStatusResponse> {
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

    const user = await datasource.manager.findOneBy(RegularUser, {
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
}
