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
import { FindOptionsWhere } from "typeorm";
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
  @Field(() => Boolean)
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

    console.log("new User is:", newUser);

    try {
      await datasource.manager.save(newUser);
    } catch (err: any) {
      console.log(err);
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
    return { users: await datasource.manager.find(RegularUser) };
  }
}
