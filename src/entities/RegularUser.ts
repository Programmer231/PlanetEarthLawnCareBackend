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

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "text", nullable: true })
  forgotpassword!: string | null;

  @Column({ type: "date", nullable: true })
  forgotPasswordExpiry!: Date | null;
}
