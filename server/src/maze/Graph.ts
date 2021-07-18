import { Vector } from "./Vector";

export type Index = number;
export type Edges = Record<Index, Index[]>;
export type Neighbours = Record<Index, Index[]>;

export class Node {
  index: Index;
  position: Vector;
  constructor(position: Vector, index: number) {
    this.index = index;
    this.position = position;
  }

  getRelativeNode(pos: Vector): Node {
    return new Node(Vector.minus(this.position, pos), this.index);
  }
}

class EdgeManager {
  edges: Set<Index>[];
  constructor() {
    this.edges = [];
  }

  createNode(): void {
    this.edges.push(new Set<Index>());
  }

  createEdge(node1: Index, node2: Index): void {
    this.edges[node1].add(node2);
    this.edges[node2].add(node1);
  }

  deleteEdge(node1: Index, node2: Index): void {
    this.edges[node1].delete(node2);
    this.edges[node2].delete(node1);
  }

  isEdge(node1: Index, node2: Index): boolean {
    return this.edges[node1].has(node2);
  }

  getEdges(node: Index): Array<Index> {
    return Array.from(this.edges[node]);
  }
}

export class Graph {
  nextIndex: number;
  nodes: Node[];
  private tunnelManager: EdgeManager;
  private neighbourManager: EdgeManager;
  constructor() {
    this.nextIndex = 0;
    this.nodes = [];
    this.tunnelManager = new EdgeManager();
    this.neighbourManager = new EdgeManager();
  }

  createNode(position: Vector): Node {
    const node = new Node(position, this.nextIndex);
    this.nodes.push(node);
    this.tunnelManager.createNode();
    this.neighbourManager.createNode();

    this.nextIndex++;

    return node;
  }

  createNeighbour(node1: Index, node2: Index): void {
    this.neighbourManager.createEdge(node1, node2);
  }

  createTunnel(node1: Index, node2: Index): void {
    this.tunnelManager.createEdge(node1, node2);
  }

  getNeighbour(node1: Index): Index[] {
    return this.neighbourManager.getEdges(node1);
  }

  getNodes(): Node[] {
    return this.nodes;
  }
  getNeighbours(): Neighbours {
    return this.nodes.map((node) => this.neighbourManager.getEdges(node.index));
  }
  getTunnels(): Edges {
    return this.nodes.map((node) => this.tunnelManager.getEdges(node.index));
  }
}
