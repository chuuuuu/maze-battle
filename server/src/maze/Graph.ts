import { Delaunay } from "d3-delaunay";
import { Vector, VectorKey } from "../utils/Vector";
import { HashTable } from "../utils/HashTable";
import { UnorderedPair, UnorderedPairKey } from "../utils/UnorderedPair";
import { Field, ObjectType } from "type-graphql";

export type Tunnels = Record<number, number[]>;
export type Neighbours = Record<number, number[]>;

@ObjectType()
export class Node {
  @Field()
  id: number;
  @Field()
  position: Vector;
  @Field(()=>[Number])
  edgeids: number[];
}

@ObjectType()
export class Edge {
  @Field()
  id: number;
  @Field(()=>[Number, Number])
  vertexid: [number, number];
  @Field(()=>[Number])
  nodeids: number[];
  @Field()
  isTunnel: boolean;
}
@ObjectType()
export class Vertex {
  @Field()
  id: number;
  @Field()
  position: Vector;
}

@ObjectType()
export class Graph {
  @Field(() => [Node])
  nodes: Node[];
  @Field(() => [Vertex])
  vertexs: Vertex[];
  @Field(() => [Edge])
  edges: Edge[];
  private vertexTable: HashTable<Vector, number>;
  private edgeTable: HashTable<UnorderedPair, number>;
  nodesToEdge: Record<number, Record<number, number>>;

  constructor() {
    this.nodes = [];
    this.vertexs = [];
    this.edges = [];
    this.vertexTable = new HashTable<Vector, number>();
    this.edgeTable = new HashTable<UnorderedPair, number>();
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
      const vertexid: number | null = this.vertexTable.find(vertexKey);
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
      const vertexid: number | null = this.vertexTable.find(vertexKey);
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

  getNeighbours(nodeid: number): number[] {
    return Array.from(Object.keys(this.nodesToEdge[nodeid])).map((str) =>
      parseInt(str)
    );
  }

  setTunnel(nodeid1: number, nodeid2: number): void {
    const edgeid = this.nodesToEdge[nodeid1][nodeid2];
    this.edges[edgeid].isTunnel = true;
  }

  getEdgeid(nodeid1: number, nodeid2: number): number {
    return this.nodesToEdge[nodeid1][nodeid2];
  }

  getWallLength(nodeid1: number, nodeid2: number): number {
    const edgeid = this.getEdgeid(nodeid1, nodeid2);
    const vertexid0 = this.edges[edgeid].vertexid[0];
    const vertexid1 = this.edges[edgeid].vertexid[1];

    const distance = Vector.distance(
      this.vertexs[vertexid0].position,
      this.vertexs[vertexid1].position
    );

    return distance;
  }
}
