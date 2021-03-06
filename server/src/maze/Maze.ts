import { Graph, Node } from "./Graph";
import { randomChoose, shuffle } from "../utils/shuffle";
import Sampler from "poisson-disk-sampling";
import { Delaunay, Voronoi } from "d3-delaunay";
import {
  Field,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from "type-graphql";

@InterfaceType()
export abstract class Maze {
  @Field()
  mazeMap: Graph;
}

export type Seen = Set<number>;

export type Boundary = [number, number];

export type DelaunayMazeConfig = {
  boundary: Boundary;
  poissonDiskSamplingConfig: {
    minDistance: number;
    maxDistance: number;
    tries: number;
  };
  minWallLen: number;
};

@ObjectType({ implements: [Maze] })
class DelaunayMaze implements Maze {
  mazeMap: Graph;
  boundary: Boundary;
  delaunay: Delaunay<Delaunay.Point>;
  voronoi: Voronoi<Delaunay.Point>;
  // points:
  constructor(delaunayMazeConfig: DelaunayMazeConfig) {
    this.boundary = delaunayMazeConfig.boundary;

    const sampler = new Sampler({
      shape: delaunayMazeConfig.boundary,
      minDistance: delaunayMazeConfig.poissonDiskSamplingConfig.minDistance,
      maxDistance: delaunayMazeConfig.poissonDiskSamplingConfig.maxDistance,
      tries: delaunayMazeConfig.poissonDiskSamplingConfig.tries,
    });

    const pdPoints = sampler.fill();
    const delaunay = Delaunay.from(pdPoints);
    const voronoi = delaunay.voronoi([
      0,
      0,
      delaunayMazeConfig.boundary[0],
      delaunayMazeConfig.boundary[1],
    ]);
    const polygons = Array.from(voronoi.cellPolygons());

    const numPoint = pdPoints.length;
    this.mazeMap = new Graph();
    for (let i = 0; i < numPoint; i++) {
      this.mazeMap.createNode(
        { x: pdPoints[i]![0]!, y: pdPoints[i]![1]! },
        polygons[i]!
      );
    }

    this.mazeMap.compile();

    const seen: Seen = new Set<number>();
    const start: number = this.mazeMap.nodes[0]!.id;

    this.buildRoad(seen, start, delaunayMazeConfig.minWallLen);
  }

  buildRoad(seen: Seen, current_nodeId: number, minWallLen: number) {
    seen.add(current_nodeId);
    const nodeids = shuffle(this.mazeMap.getNeighbours(current_nodeId));

    nodeids.forEach((next_nodeId) => {
      if (seen.has(next_nodeId)) {
        return;
      }
      if (
        this.mazeMap.getWallLength(current_nodeId, next_nodeId) < minWallLen
      ) {
        return;
      }

      this.mazeMap.setTunnel(current_nodeId, next_nodeId);
      this.buildRoad(seen, next_nodeId, minWallLen);
    });
  }
}

export const NoobMazeConfig: DelaunayMazeConfig = {
  boundary: [500, 500] as Boundary,
  minWallLen: 15,
  poissonDiskSamplingConfig: {
    minDistance: 50,
    maxDistance: 50,
    tries: 30,
  },
};

export enum MAZENAME {
  NOOB,
}

registerEnumType(MAZENAME, {
  name: "MAZENAME",
  description: "list of mazename",
});

export class MazeManager {
  static createMaze(mazename: MAZENAME): Maze {
    switch (mazename) {
      case MAZENAME.NOOB:
        return new DelaunayMaze(NoobMazeConfig);

      default:
        return new DelaunayMaze(NoobMazeConfig);
    }
  }

  static getRandomNode(maze: Maze): Node{
    return randomChoose(maze.mazeMap.nodes);
  }
}
