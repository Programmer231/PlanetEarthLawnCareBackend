import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";
// @ts-ignore
import { ObjectId } from "mongodb";
import { Estimates } from "./Estimates";

@ObjectType()
@Entity()
export class RegularUser {
  @Field(() => String)
  @ObjectIdColumn()
  _id!: ObjectId;

  @Field(() => String)
  @Column({ unique: true })
  address!: string;

  @Field()
  @Column()
  name!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field()
  @Column({ unique: true })
  phoneNumber!: string;
}
