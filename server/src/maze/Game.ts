import { Block } from "./Graph";
import { Item } from "./Item";
import { Maze, MazeFactory } from "./Maze";
import { Player } from "./Player";
import { VisibleScope } from "./Scope";

export type GameInfo = {
  visibleBlocks: Block[];
  visibleScope: VisibleScope;
  visibleItems: Item[];
  visiblePlayers: Player[];
};

export interface Game {
  id: number;
  maze: Maze;
  items: Item[];
  players: Player[];
  getGameInfo: (player: Player) => GameInfo;
  register: (player: Player) => void;
}

class NoobGame implements Game {
  id: number;
  maze: Maze;
  items: Item[];
  players: Player[];
  constructor(id: number) {
    this.id = id;
    this.maze = MazeFactory.createRegularMaze(10, 10);
    this.items = [];
    this.players = [];
  }

  register(player: Player): void {
    this.players.push(player);
  }

  getGameInfo(player: Player): GameInfo {
    return {
      visibleBlocks: this.maze.getVisibleBlocks(player),
      visibleScope: player.visibleScope,
      visibleItems: this.getVisibleItems(player),
      visiblePlayers: this.getVisiblePlayers(player),
    };
  }

  getVisibleItems(player: Player): Item[] {
    // todo
    console.log(player);
    return [];
  }

  getVisiblePlayers(player: Player): Player[] {
    // todo
    console.log(player);
    return [];
  }
}

export class GameFactory {
  static nextId = 0;
  static getNoobGame(): Game {
    const game = new NoobGame(this.nextId);
    this.nextId++;
    return game;
  }
}
