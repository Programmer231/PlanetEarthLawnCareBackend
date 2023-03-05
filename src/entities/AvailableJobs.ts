import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ObjectIdColumn } from "typeorm";
// @ts-ignore
import { ObjectId } from "mongodb";
import { Scalar, CustomScalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";

@ObjectType()
@Entity()
export class AvailableJobs {
  @Field(() => String)
  @ObjectIdColumn()
  _id!: ObjectId;

  @Field(() => String)
  @Column({ unique: true })
  name!: string;
}
