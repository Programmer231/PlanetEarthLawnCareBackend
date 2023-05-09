import { Field, Int, ObjectType } from "type-graphql";
import { Column, ObjectID, ObjectIdColumn } from "typeorm";
import { Scalar, CustomScalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";
import { AvailableJobs } from "./AvailableJobs";
// @ts-ignore
import { ObjectId } from "mongodb";
import { RegularUser } from "./RegularUser";

@ObjectType()
export class UserID {
  @Field(() => String)
  @ObjectIdColumn()
  _id!: ObjectId;
}
