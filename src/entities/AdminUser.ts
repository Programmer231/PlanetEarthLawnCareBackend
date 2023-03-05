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

@ObjectType()
@Entity()
export class AdminUser {
  @Field(() => String)
  @ObjectIdColumn()
  _id!: ObjectId | string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  password!: string;

  @Column({ type: "text", nullable: true })
  forgotpassword!: string | null;

  @Column({ type: "date", nullable: true })
  forgotPasswordExpiry!: Date | null;
}
