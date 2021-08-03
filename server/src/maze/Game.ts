import { Item } from "./Item";
import { Maze, MazeManager } from "./Maze";
import { Player, PlayerManager } from "./Player";
import { Room } from "./Room";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Game {
  @Field(() => Maze)
  maze: Maze;

  @Field(() => [Player])
  players: Player[];

  @Field(() => [Item])
  items: Item[];
}

export class GameManager {
  static games: Record<number, Game> = {};
  static createGame(room: Room): Game {
    const maze = MazeManager.createMaze(room.mazename);
    const items: Item[] = [];
    const players = room.users.map((user) => {
      const node = MazeManager.getRandomNode(maze);

      return PlayerManager.createPlayer(user, node);
    });

    const game: Game =  { maze, items, players };

    this.games[room.id] = game;

    return game;
  }
}
