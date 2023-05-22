import { Field, ObjectType } from "type-graphql";
import { ObjectIdColumn } from "typeorm";
// @ts-ignore
import { ObjectId } from "mongodb";

@ObjectType()
export class UserID {
  @Field(() => String)
  @ObjectIdColumn()
  _id!: ObjectId;
}
