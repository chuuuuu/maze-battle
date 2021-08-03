import {
  Arg,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";

@Resolver()
export class NumberResolver {
  @Subscription({
    topics: ({ args }) => args.topic,
  })
  newNumber(@Arg("topic") _: string, @Root() number: number): number {
    return number;
  }

  @Mutation(() => Number)
  async postNumber(
    @Arg("number") number: number,
    @PubSub() pubSub: PubSubEngine,
    @Arg("topic") topic: string
  ): Promise<number> {
    await pubSub.publish(topic, number);
    return number;
  }
}
