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
import { AdminUser } from "../entities/AdminUser";
import { RegularUser } from "../entities/RegularUser";
import { MyContext } from "../types";
// @ts-ignore
import { ObjectId } from "mongodb";
import { FindOptionsWhere, MongoError } from "typeorm";
import { isAuth } from "../middleware/isAuth";

@ObjectType()
class RegularUserResponse {
  @Field(() => [RegularUser], { nullable: true })
  users?: RegularUser[];

  @Field(() => [SecondErrorResponse], { nullable: true })
  errors?: SecondErrorResponse[];
}

@ObjectType()
class CreateRegularUserResponse {
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
  @Mutation(() => CreateRegularUserResponse)
  @UseMiddleware(isAuth)
  async createUser(
    @Arg("name", () => String) name: string,
    @Arg("phoneNumber", () => String) phoneNumber: string,
    @Arg("address", () => String) address: string,
    @Ctx() { req }: MyContext
  ): Promise<CreateRegularUserResponse> {
    const loggedInUser = await datasource.manager.findOneBy(AdminUser, {
      _id: new ObjectId(req.session.userId),
    } as any);

    if (!loggedInUser) {
      return {
        errors: [
          {
            field: "authorization",
            message: "not authorized to perform this action",
          },
        ],
      };
    }
    const newUser = new RegularUser();

    newUser.name = name;
    newUser.address = address;
    newUser.phoneNumber = phoneNumber;

    try {
      await datasource.manager.save(newUser);
    } catch (error: any) {
      if (error?.code === 11000) {
        return {
          errors: [
            {
              field: "Duplicate Address or Phone Number",
              message:
                "Someone else in this database already has this address or phone number, please make a new estimate under their name.",
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

  @Query(() => RegularUserResponse)
  @UseMiddleware(isAuth)
  async getUsers(@Ctx() { req }: MyContext): Promise<RegularUserResponse> {
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
}
