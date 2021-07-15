package com.chuchu.mazebattle;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class Grids implements Drawable{
    private int width;
    private int height;
    ArrayList<ArrayList<Walls>> grids;
    private int mazeSize;
    private Point position;

    public Grids(int width, int height, JSONObject json) {
        this.width = width;
        this.height = height;
        this.mazeSize = 80;
        this.position = new Point(10, 10);
        grids = new ArrayList<>();
        try {
            JSONArray jsonGrids = json.getJSONArray("grids");
            for (int i = 0; i < height; i++) {
                grids.add(new ArrayList<>());
                JSONArray row = jsonGrids.getJSONArray(i);
                for (int j = 0; j < width; j++){
                    JSONArray jsonGrid = row.getJSONObject(j).getJSONArray("walls");
                    grids.get(i).add(new Walls());
                    grids.get(i).get(j).setWall(jsonGrid);
                    grids.get(i).get(j).setMazeSize(mazeSize);
                    grids.get(i).get(j).completePath(position.x + mazeSize * j, position.y + mazeSize * i);
                }
            }


        } catch (JSONException e) {
            e.printStackTrace();
        }


    }

    @Override
    public String toString() {
        return "Grids{" +
                "width=" + width +
                ", height=" + height +
                ", grids=" + grids +
                '}';
    }

    public void setMazeSize(int mazeSize) {
        this.mazeSize = mazeSize;
    }

    public void setPosition(Point position) {
        this.position = position;
    }

    @Override
    public void draw(Canvas canvas){
        Paint mazePaint = new Paint();
        mazePaint.setStyle(Paint.Style.STROKE);
        mazePaint.setColor(Color.BLACK);
        mazePaint.setStrokeWidth((float) (mazeSize * 0.2));

        for (int i = 0; i < height; i++){
            for (int j = 0; j < width; j++){
                grids.get(i).get(j).draw(canvas, mazePaint);
            }
        }
    }

}
