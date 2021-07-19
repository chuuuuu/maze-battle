import { Delaunay } from "d3-delaunay";
import { Vector } from "../utils/Vector";
import { UnorderedTuple } from "../utils/UnorderedTuple";
import { VectorMap } from "../utils/VectorMap";

export type Index = number;
export type Tunnels = Record<Index, Index[]>;
export type Neighbours = Record<Index, Index[]>;
export type Node = { id: Index; position: Vector; edgeids: Index[] };
export type Edge = {
  id: Index;
  vertexid: [Index, Index];
  nodeids: Index[];
  isTunnel: boolean;
};
export type Vertex = { id: Index; position: Vector };

export class Graph {
  nodes: Node[];
  vertexs: Vertex[];
  edges: Edge[];
  private vertexDict: VectorMap<Index>;
  private edgeDict: VectorMap<Index>;
  private nodesToEdge: Record<Index, Record<Index, Index>>;

  constructor() {
    this.nodes = [];
    this.vertexs = [];
    this.edges = [];
    this.vertexDict = new VectorMap<Index>();
    this.edgeDict = new VectorMap<Index>();
    this.nodesToEdge = {};
  }

  createNode(position: Vector, polygon: Delaunay.Polygon): Node {
    // initialize
    // this.nodes
    const nodeid = this.nodes.length;
    const node: Node = { position, id: nodeid, edgeids: [] };
    this.nodes.push(node);

    // initialize
    // this.vertexToIndex
    // this.vertexs
    polygon.forEach((point) => {
      const vertexPosition = new Vector(point[0], point[1]);
      if (this.vertexDict.contain(vertexPosition)) {
        return;
      }

      const vertexid = this.vertexs.length;
      this.vertexDict.insert(vertexPosition, vertexid);
      this.vertexs.push({ position: vertexPosition, id: vertexid });
    });

    // initialize
    // this.edgeToIndex
    // this.edges
    let prevVertexid: number | null = null;
    // 0, 1, 2, 3, 0
    polygon.forEach((point) => {
      const vertexPosition = new Vector(point[0], point[1]);
      let vertexid: number | null = this.vertexDict.find(vertexPosition);
      [prevVertexid, vertexid] = [vertexid, prevVertexid];
      if (prevVertexid === null || vertexid === null) {
        return;
      }
      const edgeEncode = UnorderedTuple.getVector(prevVertexid, vertexid);
      if (this.edgeDict.contain(edgeEncode)) {
        return;
      }

      const edgeid = this.edges.length;
      this.edgeDict.insert(edgeEncode, edgeid);
      this.edges.push({
        id: edgeid,
        vertexid: [prevVertexid, vertexid],
        nodeids: [],
        isTunnel: false,
      });
    });

    // initialize
    // this.nodes[?].edges
    // this.edges[?].nodes
    prevVertexid = null;
    polygon.forEach((point) => {
      const vertexPosition = new Vector(point[0], point[1]);
      let vertexid: number | null = this.vertexDict.find(vertexPosition);
      [prevVertexid, vertexid] = [vertexid, prevVertexid];
      if (prevVertexid === null || vertexid === null) {
        return;
      }
      const edgeid = this.edgeDict.find(
        UnorderedTuple.getVector(prevVertexid, vertexid)
      );
      if (edgeid === null) {
        return;
      }
      const edge = this.edges[edgeid];
      const node = this.nodes[nodeid];
      edge.nodeids.push(nodeid);
      node.edgeids.push(edgeid);
    });

    return node;
  }

  compile(): void {
    const edgelen = this.edges.length;
    for (let i = 0; i < edgelen; i++) {
      const edge = this.edges[i];
      const nodeids = edge.nodeids;
      if (nodeids.length == 2) {
        this.nodesToEdge[nodeids[0]] = {};
        this.nodesToEdge[nodeids[0]][nodeids[1]] = edge.id;
        this.nodesToEdge[nodeids[1]] = {};
        this.nodesToEdge[nodeids[1]][nodeids[0]] = edge.id;
      }
    }
  }

  getNeighbours(nodeid: Index): Index[] {
    return Array.from(Object.keys(this.nodesToEdge[nodeid])).map((str) =>
      parseInt(str)
    );
  }

  // createNeighbour(nodeid1: Index, nodeid2: Index): void {
  //   this.neighbourManager.createEdge(nodeid1, nodeid2);
  // }

  setTunnel(nodeid1: Index, nodeid2: Index): void {
    const edgeid = this.nodesToEdge[nodeid1][nodeid2];
    this.edges[edgeid].isTunnel = true;
  }

  // getNeighbour(nodeid1: Index): Index[] {
  //   return this.neighbourManager.getEdges(nodeid1);
  // }

  // getNodes(): Node[] {
  //   return this.nodes;
  // }

  // getNeighbours(): Neighbours {
  //   return this.nodes.map((node) => this.neighbourManager.getEdges(node.id));
  // }
  // getTunnels(): Tunnels {
  //   return this.nodes.map((node) => this.tunnelManager.getEdges(node.id));
  // }
}
