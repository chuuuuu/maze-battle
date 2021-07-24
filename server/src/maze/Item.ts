import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Item {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  description: string;
}
