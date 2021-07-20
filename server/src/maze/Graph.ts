import { Delaunay } from "d3-delaunay";
import { Vector, VectorKey } from "../utils/Vector";
import { HashTable } from "../utils/HashTable";
import { UnorderedPair, UnorderedPairKey } from "../utils/UnorderedPair";

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
  private vertexTable: HashTable<Vector, Index>;
  private edgeTable: HashTable<UnorderedPair, Index>;
  private nodesToEdge: Record<Index, Record<Index, Index>>;

  constructor() {
    this.nodes = [];
    this.vertexs = [];
    this.edges = [];
    this.vertexTable = new HashTable<Vector, Index>();
    this.edgeTable = new HashTable<UnorderedPair, Index>();
    this.nodesToEdge = {};
  }

  createNode(position: Vector, polygon: Delaunay.Polygon): Node {
    // initialize
    // store all nodes
    const nodeid = this.nodes.length;
    const node: Node = { position, id: nodeid, edgeids: [] };
    this.nodes.push(node);

    // insert vertex if never seen
    // 0, 1, 2, 3, 0
    const pointlen = polygon.length;
    for (let i = 1; i < pointlen; i++) {
      const point = polygon[i];
      const vertexKey = VectorKey.fromPoint(point);
      if (this.vertexTable.exist(vertexKey)) continue;

      const vertexid = this.vertexs.length;
      this.vertexTable.insert({ key: vertexKey, value: vertexid });
      this.vertexs.push({ position: vertexKey.toVector(), id: vertexid });
    }

    // store edge to this.edges if never seen
    let prevVertexid = this.vertexTable.find(VectorKey.fromPoint(polygon[0]));
    for (let i = 1; i < pointlen; i++) {
      // get vertexid
      const point = polygon[i];
      const vertexKey = VectorKey.fromPoint(point);
      const vertexid: Index | null = this.vertexTable.find(vertexKey);
      if (prevVertexid === null) {
        console.error("prevVertexid should not be null");
        continue;
      }
      if (vertexid === null) {
        console.error("vertexid should not be null");
        continue;
      }

      // insert edge if never seen
      const edgeKey = new UnorderedPairKey(prevVertexid, vertexid);
      if (this.edgeTable.exist(edgeKey)) {
        prevVertexid = vertexid;
        continue;
      }

      const edgeid = this.edges.length;
      this.edgeTable.insert({ key: edgeKey, value: edgeid });
      this.edges.push({
        id: edgeid,
        vertexid: [prevVertexid, vertexid],
        nodeids: [],
        isTunnel: false,
      });

      prevVertexid = vertexid;
    }

    // initialize
    // store edgeids to this.nodes[?].edgeids
    // store nodeids to this.edges[?].nodeids
    prevVertexid = this.vertexTable.find(VectorKey.fromPoint(polygon[0]));
    for (let i = 1; i < pointlen; i++) {
      const point = polygon[i];
      const vertexKey = VectorKey.fromPoint(point);
      const vertexid: Index | null = this.vertexTable.find(vertexKey);
      if (vertexid === null) {
        console.error("vertexid should not be null");
        continue;
      }
      if (prevVertexid === null) {
        console.error("prevVertexid should not be null");
        continue;
      }

      const edgeKey = new UnorderedPairKey(prevVertexid, vertexid);

      const edgeid = this.edgeTable.find(edgeKey);
      if (edgeid === null) {
        console.error("edgeid should not be null");
        continue;
      }
      const edge = this.edges[edgeid];
      const node = this.nodes[nodeid];
      edge.nodeids.push(nodeid);
      node.edgeids.push(edgeid);

      prevVertexid = vertexid;
    }

    return node;
  }

  compile(): void {
    const edgelen = this.edges.length;
    for (let i = 0; i < edgelen; i++) {
      const edge = this.edges[i];
      const nodeids = edge.nodeids;
      if (nodeids.length !== 2) {
        continue;
      }
      if (this.nodesToEdge[nodeids[0]] === undefined) {
        this.nodesToEdge[nodeids[0]] = {};
      }
      this.nodesToEdge[nodeids[0]][nodeids[1]] = edge.id;
      if (this.nodesToEdge[nodeids[1]] === undefined) {
        this.nodesToEdge[nodeids[1]] = {};
      }
      this.nodesToEdge[nodeids[1]][nodeids[0]] = edge.id;
    }
  }

  getNeighbours(nodeid: Index): Index[] {
    return Array.from(Object.keys(this.nodesToEdge[nodeid])).map((str) =>
      parseInt(str)
    );
  }

  setTunnel(nodeid1: Index, nodeid2: Index): void {
    const edgeid = this.nodesToEdge[nodeid1][nodeid2];
    this.edges[edgeid].isTunnel = true;
  }
}
