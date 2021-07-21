package com.chuchu.mazebattle.maze;

public class Vertex { private int index;
    private PointDouble position;


    public Vertex(int index, PointDouble position) {
        this.index = index;
        this.position = position;
    }

    public Vertex() {
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
