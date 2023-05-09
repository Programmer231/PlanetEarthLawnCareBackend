import { Field, Int, ObjectType } from "type-graphql";
import { Column, ObjectIdColumn } from "typeorm";
import { Scalar, CustomScalar } from "@nestjs/graphql";
import { Kind, ValueNode } from "graphql";
import { AvailableJobs } from "./AvailableJobs";
// @ts-ignore
import { ObjectId } from "mongodb";

@ObjectType()
export class Job {
  @Field(() => Number)
  @Column()
  cost!: number;

  @Field(() => Int)
  @Column()
  quantity!: number;

  @Field(() => String)
  @ObjectIdColumn()
  @Column((type) => AvailableJobs)
  _id!: ObjectId;

  @Field(() => String)
  @Column()
  name!: string;
}
