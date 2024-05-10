import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";
import { Job } from "./Job";
// @ts-ignore
import { ObjectId } from "mongodb";
import { UserID } from "./UserId";

@ObjectType()
@Entity()
export class Estimates {
  @Field(() => String)
  @ObjectIdColumn()
  _id!: ObjectId;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => [Job])
  @Column()
  jobs!: Job[];

  @Field(() => UserID)
  @Column()
  userId!: UserID;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  address!: string;

  @Field(() => Boolean)
  @Column()
  accepted!: boolean;

  @Field(() => Number)
  @Column()
  totalCost!: number;

  @Field(() => [String])
  @Column()
  images?: string[];

  @Field(() => Boolean)
  @Column()
  checked!: boolean;
}
