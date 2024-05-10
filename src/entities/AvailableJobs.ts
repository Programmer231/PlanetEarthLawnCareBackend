import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ObjectIdColumn } from "typeorm";
// @ts-ignore
import { ObjectId } from "mongodb";

@ObjectType()
@Entity()
export class AvailableJobs {
  @Field(() => String)
  @ObjectIdColumn()
  _id!: ObjectId;

  @Field(() => String)
  @Column({ unique: true })
  name!: string;

  @Field(() => [String])
  @Column()
  images?: string[];

  @Field(() => String)
  @Column()
  description!: string;
}
