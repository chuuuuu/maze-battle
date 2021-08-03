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
  edgeIds: number[];
}

@ObjectType()
export class Edge {
  @Field()
  id: number;
  @Field(()=>[Number, Number])
  vertexId: [number, number];
  @Field(()=>[Number])
  nodeIds: number[];
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
    const nodeId = this.nodes.length;
    const node: Node = { position, id: nodeId, edgeIds: [] };
    this.nodes.push(node);

    // insert vertex if never seen
    // 0, 1, 2, 3, 0
    const pointlen = polygon.length;
    for (let i = 1; i < pointlen; i++) {
      const point = polygon[i]!;
      const vertexKey = VectorKey.fromPoint(point);
      if (this.vertexTable.exist(vertexKey)) continue;

      const vertexId = this.vertexs.length;
      this.vertexTable.insert({ key: vertexKey, value: vertexId });
      this.vertexs.push({ position: vertexKey.toVector(), id: vertexId });
    }

    // store edge to this.edges if never seen
    let prevVertexId = this.vertexTable.find(VectorKey.fromPoint(polygon[0]!));
    for (let i = 1; i < pointlen; i++) {
      // get vertexid
      const point = polygon[i]!;
      const vertexKey = VectorKey.fromPoint(point);
      const vertexId: number | null = this.vertexTable.find(vertexKey);
      if (prevVertexId === null) {
        console.error("prevVertexId should not be null");
        continue;
      }
      if (vertexId === null) {
        console.error("vertexId should not be null");
        continue;
      }

      // insert edge if never seen
      const edgeKey = new UnorderedPairKey(prevVertexId, vertexId);
      if (this.edgeTable.exist(edgeKey)) {
        prevVertexId = vertexId;
        continue;
      }

      const edgeId = this.edges.length;
      this.edgeTable.insert({ key: edgeKey, value: edgeId });
      this.edges.push({
        id: edgeId,
        vertexId: [prevVertexId, vertexId],
        nodeIds: [],
        isTunnel: false,
      });

      prevVertexId = vertexId;
    }

    // initialize
    // store edgeIds to this.nodes[?].edgeIds
    // store nodeIds to this.edges[?].nodeIds
    prevVertexId = this.vertexTable.find(VectorKey.fromPoint(polygon[0]!));
    for (let i = 1; i < pointlen; i++) {
      const point = polygon[i]!;
      const vertexKey = VectorKey.fromPoint(point);
      const vertexId: number | null = this.vertexTable.find(vertexKey);
      if (vertexId === null) {
        console.error("vertexid should not be null");
        continue;
      }
      if (prevVertexId === null) {
        console.error("prevVertexid should not be null");
        continue;
      }

      const edgeKey = new UnorderedPairKey(prevVertexId, vertexId);

      const edgeId = this.edgeTable.find(edgeKey);
      if (edgeId === null) {
        console.error("edgeid should not be null");
        continue;
      }
      const edge = this.edges[edgeId]!;
      const node = this.nodes[nodeId]!;
      edge.nodeIds.push(nodeId);
      node.edgeIds.push(edgeId);

      prevVertexId = vertexId;
    }

    return node;
  }

  compile(): void {
    const edgelen = this.edges.length;
    for (let i = 0; i < edgelen; i++) {
      const edge = this.edges[i]!;
      const nodeIds = edge.nodeIds!;
      if (nodeIds.length !== 2) {
        continue;
      }
      if (this.nodesToEdge[nodeIds[0]!] === undefined) {
        this.nodesToEdge[nodeIds[0]!] = {};
      }
      this.nodesToEdge[nodeIds[0]!]![nodeIds[1]!] = edge.id;
      if (this.nodesToEdge[nodeIds[1]!] === undefined) {
        this.nodesToEdge[nodeIds[1]!] = {};
      }
      this.nodesToEdge[nodeIds[1]!]![nodeIds[0]!] = edge.id;
    }
  }

  getNeighbours(nodeId: number): number[] {
    return Array.from(Object.keys(this.nodesToEdge[nodeId]!)).map((str) =>
      parseInt(str)
    );
  }

  setTunnel(nodeId1: number, nodeId2: number): void {
    const edgeid = this.nodesToEdge[nodeId1]![nodeId2]!;
    this.edges[edgeid]!.isTunnel = true;
  }

  getEdgeId(nodeId1: number, nodeId2: number): number {
    return this.nodesToEdge[nodeId1]![nodeId2]!;
  }

  getWallLength(nodeId1: number, nodeId2: number): number {
    const edgeId = this.getEdgeId(nodeId1, nodeId2);
    const vertexId0 = this.edges[edgeId]!.vertexId[0];
    const vertexId1 = this.edges[edgeId]!.vertexId[1];

    const distance = Vector.distance(
      this.vertexs[vertexId0]!.position,
      this.vertexs[vertexId1]!.position
    );

    return distance;
  }
}
