package com.chuchu.mazebattle.maze;

import java.util.ArrayList;

public class Edge{
    private int edgeId;

    private ArrayList<Integer> vertexIds;
    private boolean isTunnel;

    public Edge(int edgeId, ArrayList<Integer> vertexIds, boolean isTunnel) {
        this.edgeId = edgeId;
        this.vertexIds = vertexIds;
        this.isTunnel = isTunnel;
    }

    public boolean isTunnel() {
        return isTunnel;
    }

    public void setTunnel(boolean tunnel) {
        isTunnel = tunnel;
    }

    public int getEdgeId() {
        return edgeId;
    }

    public void setEdgeId(int edgeId) {
        this.edgeId = edgeId;
    }

    public ArrayList<Integer> getVertexIds() {
        return vertexIds;
    }

    public void setVertexIds(ArrayList<Integer> vertexIds) {
        this.vertexIds = vertexIds;
    }


}
