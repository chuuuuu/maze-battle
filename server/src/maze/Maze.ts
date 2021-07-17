import { Vector } from "./Vector";
import { Node, Index, Graph } from "./Graph";
import { shuffle } from "../utils/shuffle";
import { Player } from "./Player";
import { VisibleScope } from "./Scope";

export interface Maze {
  mazeMap: Graph;
  getVisibleNodeInfo(player: Player): VisibleNodeInfo;
}

export type Seen = Set<Index>;

export type Edge = Index[];

export type VisibleNodeInfo = [Node, Edge][];

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

  getVisibleNodeInfo(player: Player): VisibleNodeInfo {
    const visibleScope = player.visibleScope;
    const node = player.currentNode;
    const seen: Seen = new Set<Index>();
    const playerPosition = player.position;

    const visibleNodeInfo: VisibleNodeInfo = [];
    this.getVisibleNodeInfoDFS(
      playerPosition,
      seen,
      node,
      visibleScope,
      visibleNodeInfo
    );
    return visibleNodeInfo;
  }

  getVisibleNodeInfoDFS(
    playerPosition: Vector,
    seen: Seen,
    current_node: Node,
    visibleScope: VisibleScope,
    visibleNodeInfo: VisibleNodeInfo
  ): void {
    visibleNodeInfo.push([
      current_node,
      this.mazeMap.tunnelManager
        .getEdges(current_node)
        .map((node) => node.index),
    ]);
    seen.add(current_node.index);

    const nodes = this.mazeMap.neighbourManager.getEdges(current_node);
    nodes.forEach((next_node) => {
      if (seen.has(next_node.index)) {
        return;
      }

      if (!visibleScope.isInBoundary(playerPosition, next_node.position)) {
        return;
      }

      this.getVisibleNodeInfoDFS(
        playerPosition,
        seen,
        next_node,
        visibleScope,
        visibleNodeInfo
      );
    });
  }
}

export class MazeFactory {
  static createRegularMaze(width: number, height: number): RegularMaze {
    const seen: Seen = new Set<Index>();
    const maze = new RegularMaze(width, height);
    const start: Node = maze.mazeMap.nodes[0];

    this.build_road(maze.mazeMap, seen, start);

    console.log(
      JSON.stringify(
        maze.mazeMap.tunnelManager.edges.map((edge) => Array.from(edge))
      )
    );
    return maze;
  }

  static build_road(mazeMap: Graph, seen: Seen, current_node: Node): void {
    seen.add(current_node.index);
    const nodes = mazeMap.neighbourManager.getEdges(current_node);
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
