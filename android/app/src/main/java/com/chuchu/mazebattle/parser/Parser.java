package com.chuchu.mazebattle.parser;



import android.graphics.Point;

import com.chuchu.mazebattle.maze.Node;
import com.chuchu.mazebattle.maze.PointDouble;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class Parser {
    // Create node array by parsing jsonNodes, jsonTunnels and jsonNeighbors
    public static ArrayList<Node> nodeParser(JSONArray jsonNodes, JSONArray jsonTunnels, JSONArray jsonNeighbors){
        ArrayList<Node> nodes = new ArrayList<>();
        for (int i = 0; i < jsonNodes.length(); i++){
            try {
                JSONObject jsonPosition = jsonNodes.getJSONObject(i).getJSONObject("position");
                JSONArray jsonTunnel = jsonTunnels.getJSONArray(i);
                JSONArray jsonNeighbor = jsonNeighbors.getJSONArray(i);
                Node node = new Node(i, new PointDouble(jsonPosition.getDouble("x"), jsonPosition.getDouble("y")), toTunnels(jsonTunnel), toNeighbors(jsonNeighbor));
                nodes.add(node);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return nodes;
    }



    private static ArrayList<Integer> toTunnels(JSONArray jsonTunnels) throws JSONException {
        ArrayList<Integer> tunnels = new ArrayList<>();
        for (int i = 0; i < jsonTunnels.length(); i++){
            tunnels.add(jsonTunnels.getInt(i));
        }
        return tunnels;
    }


    private static ArrayList<Integer> toNeighbors(JSONArray jsonNeighbors) throws JSONException {
        ArrayList<Integer> neighbors = new ArrayList<>();
        for (int i = 0; i < jsonNeighbors.length(); i++){
            neighbors.add(jsonNeighbors.getInt(i));
        }
        return neighbors;
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
}
