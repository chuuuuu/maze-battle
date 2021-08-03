import { Game, GameManager } from "../maze/Game";
import { RoomManager } from "../maze/Room";
import { MyContext } from "../types";
import {
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
  Root,
  Subscription,
  ObjectType,
  Field,
} from "type-graphql";

@ObjectType()
class ReadyResponse {
  @Field()
  userId: number;
  @Field()
  isReady: boolean;
}

@Resolver()
export class GameResolver {
  @Subscription({
    topics: ({ context }) => {
      const { userId } = (context as MyContext).req.session;

      if (!userId) {
        throw new Error("you should login first");
      }

      return `${userId}|ready`;
    },
  })
  subscribeReady(@Root() res: ReadyResponse): ReadyResponse {
    return res;
  }

  @Subscription({
    topics: ({ context }) => {
      const { userId } = (context as MyContext).req.session;

      if (!userId) {
        throw new Error("you are not in any room");
      }

      return `${userId}|start`;
    },
  })
  subscribeStart(@Root() res: Game): Game {
    return res;
  }

  @Mutation(() => Boolean)
  async negReady(
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error("you should login first");
    }

    const roomId = req.session.roomId;
    const isReady = req.session.isReady;
    if (!roomId || isReady === undefined) {
      throw new Error("you are not in any room");
    }

    const room = RoomManager.findOne(roomId);
    if(room.game){
      throw new Error("the game has already stated.")
    }

    req.session.isReady = !isReady;
    const res: ReadyResponse = {
      isReady: req.session.isReady,
      userId: userId,
    };

    await Promise.all(room.users.map(async (user) => {
      const userId = user.id;
      await pubSub.publish(`${userId}|ready`, res);
    }));

    if (req.session.isReady) {
      room.isReadySet.add(userId);
    } else {
      room.isReadySet.delete(userId);
    }

    const minUserNum = 2;
    if (
      room.isReadySet.size >= minUserNum &&
      room.isReadySet.size === room.users.length
    ) {
      const game = GameManager.createGame(room);
      room.game = game;
      await pubSub.publish(`${roomId}|start`, game);
    }

    return true;
  }
}
