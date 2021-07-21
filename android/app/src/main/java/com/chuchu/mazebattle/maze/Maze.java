package com.chuchu.mazebattle.maze;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.view.inputmethod.CursorAnchorInfo;

import com.chuchu.mazebattle.Drawable;
import com.chuchu.mazebattle.R;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;

public class Maze implements Drawable {
    private ArrayList<Vertex> vertices;
    private ArrayList<Edge> edges;
    private int scaleLevel;
    private int width;
    private int height;
    public Maze(ArrayList<Vertex> vertices, ArrayList<Edge> edges, int width, int height) {
        this.vertices = vertices;
        this.edges = edges;
        this.width = width;
        this.height = height;
        scaleLevel = 20;


        Collections.sort(this.edges, new EdgeComparator(vertices));
    }

    public ArrayList<Vertex> getVertices() {
        return vertices;
    }

    public void setVertices(ArrayList<Vertex> vertices) {
        this.vertices = vertices;
    }

    public ArrayList<Edge> getEdges() {
        return edges;
    }

    public void setEdges(ArrayList<Edge> edges) {
        this.edges = edges;
    }

    @Override
    public void draw(Canvas canvas) {
        Paint mazePaint = new Paint();
        mazePaint.setStrokeWidth(4);
        mazePaint.setColor(Color.YELLOW);

        Paint mazeBorderPaint = new Paint();
        mazeBorderPaint.setColor(Color.BLACK);
        mazeBorderPaint.setStrokeWidth(8);
        mazeBorderPaint.setStyle(Paint.Style.STROKE);

        drawMazeUpperBorder(canvas, mazePaint, mazeBorderPaint);

        for (int i = 0; i < edges.size(); i++){
            if (!edges.get(i).isTunnel()){
                PointDouble p1 = vertices.get(edges.get(i).getVertexIds().get(0)).getPosition();
                PointDouble p2 = vertices.get(edges.get(i).getVertexIds().get(1)).getPosition();
                if (p1.y == 0 && p2.y == 0 || p1.y == height * scaleLevel && p2.y == height * scaleLevel) continue;

                Path wall = new Path();
                wall.moveTo((float) p1.x * scaleLevel, (float) p1.y * scaleLevel);
                wall.lineTo((float) p2.x * scaleLevel, (float) p2.y * scaleLevel);
                wall.lineTo((float) p2.x * scaleLevel, (float) (p2.y - 3) * scaleLevel);
                wall.lineTo((float) p1.x * scaleLevel, (float) (p1.y - 3) * scaleLevel);
                wall.close();
                canvas.drawPath(wall, mazePaint);


                canvas.drawPath(wall, mazeBorderPaint);
            }
        }

        drawMazeLowerBorder(canvas, mazePaint, mazeBorderPaint);


    }

    private void drawMazeUpperBorder(Canvas canvas, Paint mazePaint, Paint mazeBorderPaint){
        Path mazeBorder = new Path();
        mazeBorder.moveTo(0, 0);
        mazeBorder.lineTo((float) width * scaleLevel, (float) 0 * scaleLevel);
        mazeBorder.lineTo((float) width * scaleLevel, (float) (0 - 3) * scaleLevel);
        mazeBorder.lineTo((float) 0 * scaleLevel, (float) (0 - 3) * scaleLevel);
        mazeBorder.close();

        canvas.drawPath(mazeBorder, mazePaint);
        canvas.drawPath(mazeBorder, mazeBorderPaint);

    }

    private void drawMazeLowerBorder(Canvas canvas, Paint mazePaint, Paint mazeBorderPaint){
        Path mazeBorder = new Path();
        mazeBorder.moveTo(0, height * scaleLevel);
        mazeBorder.lineTo((float) width * scaleLevel, (float) height * scaleLevel);
        mazeBorder.lineTo((float) width * scaleLevel, (float) (height - 3) * scaleLevel);
        mazeBorder.lineTo((float) 0 * scaleLevel, (float) (height - 3) * scaleLevel);
        mazeBorder.close();

        canvas.drawPath(mazeBorder, mazePaint);
        canvas.drawPath(mazeBorder, mazeBorderPaint);
    }

}

class EdgeComparator implements Comparator<Edge> {
    private ArrayList<Vertex> vertices;

    public EdgeComparator(ArrayList<Vertex> vertices){
        this.vertices = vertices;
    }

    @Override
    public int compare(Edge e1, Edge e2) {
        Double higherOfe1 = Math.min(vertices.get(e1.getVertexIds().get(0)).getPosition().y, vertices.get(e1.getVertexIds().get(1)).getPosition().y);
        Double higherOfe2 = Math.min(vertices.get(e2.getVertexIds().get(0)).getPosition().y, vertices.get(e2.getVertexIds().get(1)).getPosition().y);
        if (higherOfe2 > higherOfe1) return -1;
        else if (higherOfe1 > higherOfe2) return 1;
        else return 0;
    }
}


