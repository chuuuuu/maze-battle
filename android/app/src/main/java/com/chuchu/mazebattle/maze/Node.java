package com.chuchu.mazebattle.maze;



import java.util.ArrayList;

public class Node {
    private int index;
    private PointDouble position;


    public Node(int index, PointDouble position) {
        this.index = index;
        this.position = position;
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



}
