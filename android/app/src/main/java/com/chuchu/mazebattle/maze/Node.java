package com.chuchu.mazebattle.maze;



import java.util.ArrayList;

public class Node {
    private int index;
    private PointDouble position;
    private ArrayList<Integer> tunnels;
    private ArrayList<Integer> neighbors;

    public Node(int index, PointDouble position, ArrayList<Integer> tunnels, ArrayList<Integer> neighbors) {
        this.index = index;
        this.position = position;
        this.tunnels = tunnels;
        this.neighbors = neighbors;
    }

    public Node() {
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public PointDouble getPosition() {
        return position;
    }

    public void setPosition(PointDouble position) {
        this.position = position;
    }

    public ArrayList<Integer> getTunnels() {
        return tunnels;
    }

    public void setTunnels(ArrayList<Integer> tunnels) {
        this.tunnels = tunnels;
    }

    public ArrayList<Integer> getNeighbors() {
        return neighbors;
    }

    public void setNeighbors(ArrayList<Integer> neighbors) {
        this.neighbors = neighbors;
    }

    public boolean isTunnel(int otherIndex){
        for (int i = 0; i < tunnels.size(); i++){
            if (tunnels.get(i) == otherIndex) return true;
        }
        return false;
    }
}
