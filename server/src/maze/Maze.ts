import { Index, Graph, Node, Neighbours, Tunnels } from "./Graph";
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
  neighbours: Neighbours;
  tunnels: Tunnels;
  boundary: Boundary;
  delaunay_points: number[];
  delaunay_triangles: number[];
  delaunay_halfedges: number[];
  voronoi_circumcenters: number[];
  voronoi_vectors: number[];
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
    const numPoint = pdPoints.length;
    this.mazeMap = new Graph();
    for (let i = 0; i < numPoint; i++) {
      this.mazeMap.createNode({ x: pdPoints[i][0], y: pdPoints[i][1] });
    }

    this.delaunay = Delaunay.from(pdPoints);
    for (let i = 0, n = this.delaunay.halfedges.length; i < n; ++i) {
      const j = this.delaunay.halfedges[i];
      if (j < i) continue;
      const ti = this.delaunay.triangles[i];
      const tj = this.delaunay.triangles[j];
      this.mazeMap.createNeighbour(ti, tj);
    }

    this.voronoi = this.delaunay.voronoi([0, 0, boundary[0], boundary[1]]);
  }

  getInfo(): MazeInfo {
    return {
      nodes: this.mazeMap.getNodes(),
      neighbours: this.mazeMap.getNeighbours(),
      tunnels: this.mazeMap.getTunnels(),
      boundary: this.boundary,
      delaunay_points: Array.from(this.delaunay.points),
      delaunay_triangles: Array.from(this.delaunay.triangles),
      delaunay_halfedges: Array.from(this.delaunay.halfedges),
      voronoi_circumcenters: Array.from(this.voronoi.circumcenters),
      voronoi_vectors: Array.from(this.voronoi.vectors),
    };
  }
}

export class MazeFactory {
  static createDelaunayMaze(width: number, height: number): DelaunayMaze {
    const seen: Seen = new Set<Index>();
    const maze = new DelaunayMaze([width, height]);
    const start: Index = maze.mazeMap.nodes[0].index;

    this.build_road(maze.mazeMap, seen, start);
    return maze;
  }

  static build_road(mazeMap: Graph, seen: Seen, current_node: Index): void {
    seen.add(current_node);
    const nodes = mazeMap.getNeighbour(current_node);
    shuffle<Index>(nodes);
    nodes.forEach((next_node) => {
      if (seen.has(next_node)) {
        return;
      }

      mazeMap.createTunnel(current_node, next_node);
      this.build_road(mazeMap, seen, next_node);
    });
  }
}
