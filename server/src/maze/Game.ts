import { Grid } from "./Grid";
import { Item } from "./Item";
import { getMaze, Maze } from "./Maze";
import { Player } from "./Player";
import { VisibleScope } from "./Scope";

type GameInfo = {
  visibleGrids: Grid[][];
  visibleScope: VisibleScope;
  visibleItems: Item[];
  visiblePlayers: Player[];
};

interface Game {
  id: number;
  maze: Maze;
  items: Item[];
  players: Player[];
  getGameInfo: (player: Player) => GameInfo;
}

class NoobGame implements Game {
  id: number;
  maze: Maze;
  items: Item[];
  players: Player[];
  constructor() {
    this.maze = getMaze(10, 10);
  }

  getGameInfo(player: Player): GameInfo {
    return {
      visibleGrids: this.maze.getVisibleGrids(player),
      visibleScope: player.visibleScope,
      visibleItems: this.getVisibleItems(player),
      visiblePlayers: this.getVisiblePlayers(player),
    };
  }

  getVisibleItems(player: Player): Item[] {
    // todo
    return [];
  }

  getVisiblePlayers(player: Player): Player[] {
    // todo
    return [];
  }
}

export class GameFactory {
  static getNoobGame(): Game {
    return new NoobGame();
  }
}
