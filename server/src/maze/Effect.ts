import { Field, InterfaceType } from "type-graphql";

// buffs, debuff, etc...
@InterfaceType()
export abstract class Effect {
  @Field()
  name: string;
}
