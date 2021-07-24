// import { Field, ObjectType, InterfaceType } from "type-graphql";
// import { Item } from "./Item";
// import { Maze, MazeFactory, MAZENAME } from "./Maze";

// @InterfaceType()
// export abstract class Game {
//   id: number;
//   maze: Maze;
//   items: Item[];
//   players: Player[];
// }

// class NoobGame implements Game {
//   id: number;
//   maze: Maze;
//   items: Item[];
//   players: Player[];
//   constructor(id: number) {
//     this.id = id;
//     this.maze = MazeFactory.createMaze(MAZENAME.NOOB);
//     this.items = [];
//     this.players = [];
//   }
// }

// export enum GAMENAME {
//   NOOB,
// }

// export class GameManager {
//   static nextid = 0;

//   static createGame(gamename: GAMENAME): Game {
//     const id = this.nextid;
//     this.nextid++;
//     switch (gamename) {
//       case GAMENAME.NOOB:
//         return new NoobGame(id);

//       default:
//         return new NoobGame(id);
//     }
//   }
// }
