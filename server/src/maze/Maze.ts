import { Index, Graph, Node, Edge, Vertex } from "./Graph";
import { shuffle } from "../utils/shuffle";
import Sampler from "poisson-disk-sampling";
import { Delaunay, Voronoi } from "d3-delaunay";

export interface Maze {
  mazeMap: Graph;
  getInfo(): MazeInfo;
}

export type Seen = Set<Index>;

export type MazeInfo = {
  nodes: Node[];
  edges: Edge[];
  vertexs: Vertex[];
  boundary: Boundary;
};

export type Boundary = [number, number];

class DelaunayMaze implements Maze {
  mazeMap: Graph;
  boundary: Boundary;
  delaunay: Delaunay<Delaunay.Point>;
  voronoi: Voronoi<Delaunay.Point>;
  // points:
  constructor(boundary: Boundary) {
    this.boundary = boundary;

    const sampler = new Sampler({
      shape: boundary,
      minDistance: 10,
      maxDistance: 20,
      tries: 30,
    });

    const pdPoints = sampler.fill();
    const delaunay = Delaunay.from(pdPoints);
    const voronoi = delaunay.voronoi([0, 0, boundary[0], boundary[1]]);
    const polygons = Array.from(voronoi.cellPolygons());

    const numPoint = pdPoints.length;
    this.mazeMap = new Graph();
    for (let i = 0; i < numPoint; i++) {
      this.mazeMap.createNode(
        { x: pdPoints[i][0], y: pdPoints[i][1] },
        polygons[i]
      );
    }

    // console.log(this.mazeMap);

    this.mazeMap.compile();
  }

  getInfo(): MazeInfo {
    return {
      nodes: this.mazeMap.nodes,
      edges: this.mazeMap.edges,
      vertexs: this.mazeMap.vertexs,
      boundary: this.boundary,
    };
  }
}

export class MazeFactory {
  static createDelaunayMaze(width: number, height: number): DelaunayMaze {
    const seen: Seen = new Set<Index>();
    const maze = new DelaunayMaze([width, height]);
    const start: Index = maze.mazeMap.nodes[0].id;

    this.build_road(maze.mazeMap, seen, start);
    return maze;
  }

  static build_road(mazeMap: Graph, seen: Seen, current_nodeid: Index): void {
    seen.add(current_nodeid);
    const nodeids = shuffle<Index>(mazeMap.getNeighbours(current_nodeid));
    nodeids.forEach((next_nodeid) => {
      if (seen.has(next_nodeid)) {
        return;
      }

      mazeMap.setTunnel(current_nodeid, next_nodeid);
      this.build_road(mazeMap, seen, next_nodeid);
    });
  }
}
