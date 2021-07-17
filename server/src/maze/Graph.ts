import { Vector } from "src/maze/Vector";

export type Index = number;

export class Block {
  position: Vector;
  constructor(position: Vector) {
    this.position = position;
  }
}

export class Node {
  index: Index;
  block: Block;
  constructor(position: Vector, index: number) {
    this.index = index;
    this.block = new Block(position);
  }
}

class EdgeManager {
  nodes: Node[]
  edges: Set<Index>[];
  constructor(nodes: Node[]) {
    this.nodes = nodes;
    this.edges = [];
  }
  createNode(): void {
    this.edges.push(new Set<Index>());
  }

  createEdge(node1: Node, node2: Node): void {
    this.edges[node1.index].add(node2.index);
    this.edges[node2.index].add(node1.index);
  }

  deleteEdge(node1: Node, node2: Node): void {
    this.edges[node1.index].delete(node2.index);
    this.edges[node2.index].delete(node1.index);
  }

  isEdge(node1: Node, node2: Node): boolean {
    return this.edges[node1.index].has(node2.index);
  }

  getEdges(node: Node): Array<Node> {
    return Array.from(this.edges[node.index]).map(index=>this.nodes[index]);
  }
}

export class Graph {
  nextIndex: number;
  nodes: Node[];
  tunnelManager: EdgeManager;
  neighbourManager: EdgeManager;
  constructor() {
    this.nextIndex = 0;
    this.nodes = [];
    this.tunnelManager = new EdgeManager(this.nodes);
    this.neighbourManager = new EdgeManager(this.nodes);
  }

  createNode(position: Vector): Node {
    const node = new Node(position, this.nextIndex);
    this.nodes.push(node);
    this.tunnelManager.createNode();
    this.neighbourManager.createNode();

    this.nextIndex++;

    return node;
  }
}