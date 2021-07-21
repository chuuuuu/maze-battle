package com.chuchu.mazebattle.parser;



import android.graphics.Point;

import com.chuchu.mazebattle.maze.Edge;
import com.chuchu.mazebattle.maze.Node;
import com.chuchu.mazebattle.maze.PointDouble;
import com.chuchu.mazebattle.maze.Vertex;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class Parser {
    // Create node array by parsing jsonNodes, jsonTunnels and jsonNeighbors
    public static ArrayList<Node> nodeParser(JSONArray jsonNodes){
        ArrayList<Node> nodes = new ArrayList<>();
        for (int i = 0; i < jsonNodes.length(); i++){
            try {
                JSONObject jsonPosition = jsonNodes.getJSONObject(i).getJSONObject("position");
                Node node = new Node(jsonNodes.getJSONObject(i).getInt("id"), new PointDouble(jsonPosition.getDouble("x"), jsonPosition.getDouble("y")));
                nodes.add(node);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return nodes;
    }

    // Create node array by parsing jsonNodes, jsonTunnels and jsonNeighbors
    public static ArrayList<Vertex> vertexParser(JSONArray jsonVertices){
        ArrayList<Vertex> vertices = new ArrayList<>();
        for (int i = 0; i < jsonVertices.length(); i++){
            try {
                JSONObject jsonPosition = jsonVertices.getJSONObject(i).getJSONObject("position");
                Vertex vertex = new Vertex(jsonVertices.getJSONObject(i).getInt("id"), new PointDouble(jsonPosition.getDouble("x"), jsonPosition.getDouble("y")));
                vertices.add(vertex);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return vertices;
    }


    // Create edges
    public static ArrayList<Edge> edgeParser(JSONArray jsonEdges) throws JSONException {
        ArrayList<Edge> edges = new ArrayList<>();
        for (int i = 0; i < jsonEdges.length(); i++){
            JSONObject jsonEdge = jsonEdges.getJSONObject(i);
            edges.add(new Edge(jsonEdge.getInt("id"), toVertexIds(jsonEdge.getJSONArray("vertexid")), jsonEdge.getBoolean("isTunnel")));
        }
        return edges;
    }

    // Create triangles
    public static ArrayList<Integer> triangleParser(JSONArray jsonTriangles) throws JSONException {
        ArrayList<Integer> triangles = new ArrayList<>();
        for (int i = 0; i < jsonTriangles.length(); i++){
            triangles.add(jsonTriangles.getInt(i));
        }
        return triangles;
    }

    // Create halfEdges
    public static ArrayList<Integer> halfEdgeParser(JSONArray jsonHalfEdges) throws JSONException {
        ArrayList<Integer> halfEdges = new ArrayList<>();
        for (int i = 0; i < jsonHalfEdges.length(); i++){
            halfEdges.add(jsonHalfEdges.getInt(i));
        }
        return halfEdges;
    }

    // Create circumcenters
    public static ArrayList<PointDouble> circumcenterParser(JSONArray jsonCircumcenters) throws JSONException {
        ArrayList<PointDouble> circumcenters = new ArrayList<>();
        for (int i = 0; i < jsonCircumcenters.length() / 2; i++){
            PointDouble point = new PointDouble(jsonCircumcenters.getDouble(2 * i), jsonCircumcenters.getDouble(2 * i + 1));
            circumcenters.add(point);
        }
        return circumcenters;
    }

    private static ArrayList<Integer> toVertexIds(JSONArray jsonVertexIds) throws JSONException {
        ArrayList<Integer> vertexIds = new ArrayList<>();
        for (int i = 0; i < jsonVertexIds.length(); i++){
            vertexIds.add(jsonVertexIds.getInt(i));
        }
        return vertexIds;
    }
}
