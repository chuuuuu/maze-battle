import { Vector } from "./Vector";
import { Node, Index, Graph, Block } from "./Graph";
import { shuffle } from "../utils/shuffle";
import { Player } from "./Player";
import { VisibleScope } from "./Scope";

export interface Maze {
  mazeMap: Graph;
  getVisibleBlocks(player: Player): Block[];
}

export type Seen = Set<Index>;

export class RegularMaze implements Maze {
  mazeMap: Graph;
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.mazeMap = new Graph();
    this.width = width;
    this.height = height;
    const nodes: Node[][] = [];

    for (let x = 0; x < width; x++) {
      nodes.push([]);
      for (let y = 0; y < height; y++) {
        const node = this.mazeMap.createNode(new Vector(x + 0.5 * y, y));
        nodes[x].push(node);
      }
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const possibleNeighbour = [
          [0, -1],
          [1, -1],
          [1, 0],
          [0, 1],
          [-1, 1],
          [-1, 0],
        ];
        possibleNeighbour.forEach(([dx, dy]) => {
          if (this.isValid(x + dx, y + dy)) {
            this.mazeMap.tunnelManager.createEdge(
              nodes[x][y],
              nodes[x + dx][y + dy]
            );
            this.mazeMap.neighbourManager.createEdge(
              nodes[x][y],
              nodes[x + dx][y + dy]
            );
          }
        });
      }
    }
  }

  isValid(x: number, y: number): boolean {
    if (x < 0) return false;
    if (x >= this.width) return false;
    if (y < 0) return false;
    if (y >= this.height) return false;

    return true;
  }

  getVisibleBlocks(player: Player): Block[] {
    const visibleScope = player.visibleScope;
    const node = player.currentNode;
    const seen: Seen = new Set<Index>();

    const visibleBlocks: Block[] = [];
    this.getVisibleBlocksDFS(seen, node, visibleScope, visibleBlocks);
    return visibleBlocks;
  }

  getVisibleBlocksDFS(
    seen: Seen,
    current_node: Node,
    visibleScope: VisibleScope,
    visibleBlocks: Block[]
  ): void {
    visibleBlocks.push(current_node.block);
    seen.add(current_node.index);

    const nodes = this.mazeMap.neighbourManager.getEdges(current_node);
    shuffle<Node>(nodes);
    nodes.forEach((next_node) => {
      if (seen.has(next_node.index)) {
        return;
      }

      if(!visibleScope.isInBoundary(current_node.block.position, next_node.block.position)){
        return;
      }

      this.getVisibleBlocksDFS(seen, next_node, visibleScope, visibleBlocks);
    });
  }
}

export class MazeFactory {
  static createRegularMaze(width: number, height: number): RegularMaze {
    const seen: Seen = new Set<Index>();
    const maze = new RegularMaze(width, height);
    const start: Node = maze.mazeMap.nodes[0];

    this.build_road(maze.mazeMap, seen, start);

    return maze;
  }

  static build_road(mazeMap: Graph, seen: Seen, current_node: Node): void {
    seen.add(current_node.index);
    const nodes = mazeMap.tunnelManager.getEdges(current_node);
    shuffle<Node>(nodes);
    nodes.forEach((next_node) => {
      if (seen.has(next_node.index)) {
        return;
      }

      mazeMap.tunnelManager.createEdge(current_node, next_node);
      this.build_road(mazeMap, seen, next_node);
    });
  }
}
