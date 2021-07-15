package com.chuchu.mazebattle;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.Arrays;

public class Walls{
    private boolean[] walls;
    public final int RIGHT = 0;
    public final int DOWN = 1;
    public final int LEFT = 2;
    public final int UP = 3;
    public int mazeSize;
    private Path path;
    public void setMazeSize(int mazeSize) {
        this.mazeSize = mazeSize;
    }

    public Walls() {
        this.walls = new boolean[4];
        this.mazeSize = 10;
        this.path = new Path();
    }

    public boolean getWall(int direction) {
        return walls[direction];
    }

    public void setWall(JSONArray walls) {
        try {
            for (int i = 0; i < 4; i++) {
                this.walls[i] = walls.getBoolean(i);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String toString() {
        return "Walls{" +
                "walls=" + Arrays.toString(walls) +
                '}';
    }

    public void completePath(int x, int y){
        if (walls[UP]){
            path.moveTo((float) (x - mazeSize * 0.1), y);
            path.lineTo((float) (x + mazeSize * 1.1), y);
        }
        if (walls[DOWN]){
            path.moveTo((float) (x - mazeSize * 0.1), y + mazeSize);
            path.lineTo((float) (x + mazeSize * 1.1), y + mazeSize);
        }
        if (walls[LEFT]){
            path.moveTo(x, (float) (y - mazeSize * 0.1));
            path.lineTo(x, (float) (y + mazeSize * 1.1));
        }
        if (walls[RIGHT]){
            path.moveTo(x + mazeSize, (float) (y - mazeSize * 0.1));
            path.lineTo(x + mazeSize, (float) (y + mazeSize * 1.1));
        }
        
    }

    public void draw(Canvas canvas, Paint mazePaint){


        canvas.drawPath(path, mazePaint);


    }
}
