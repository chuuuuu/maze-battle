import { Item } from "./Item";
import { Maze, MazeFactory, MazeInfo } from "./Maze";
import { Player, PlayerInfo } from "./Player";

export type GameInfo = {
  playerInfo: PlayerInfo;
  mazeInfo: MazeInfo;
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
  constructor(id: number, width: number, height: number) {
    this.id = id;
    this.maze = MazeFactory.createDelaunayMaze(width, height);
    this.items = [];
    this.players = [];
  }

  register(player: Player): void {
    this.players.push(player);
  }

  getGameInfo(player: Player): GameInfo {
    return {
      playerInfo: player.getInfo(),
      mazeInfo: this.maze.getInfo(),
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
  static getNoobGame(width: number, height: number): Game {
    const game = new NoobGame(this.nextId, width, height);
    this.nextId++;
    return game;
  }
}
