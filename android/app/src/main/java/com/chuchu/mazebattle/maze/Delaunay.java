package com.chuchu.mazebattle.maze;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;

import com.chuchu.mazebattle.Drawable;

import java.util.ArrayList;

public class Delaunay implements Drawable {
    // Delaunay.triangles[e] returns the point id where the half-edge starts
    private ArrayList<Integer> triangles;
    // Delaunay.halfEdges[e] returns the opposite half-edge in the adjacent triangle, or -1 if there is no adjacent triangle
    private ArrayList<Integer> halfEdges;

    private ArrayList<PointDouble> circumcenters;

    private ArrayList<Node> points;

    public Delaunay(ArrayList<Integer> triangles, ArrayList<Integer> halfEdges, ArrayList<PointDouble> circumcenters, ArrayList<Node> points) {
        this.triangles = triangles;
        this.halfEdges = halfEdges;
        this.circumcenters = circumcenters;
        this.points = points;
    }


    @Override
    public void draw(Canvas canvas) {

        Paint mazePaint = new Paint();
        mazePaint.setStrokeWidth(2);
        mazePaint.setColor(Color.BLACK);

        Paint recPaint = new Paint();
        recPaint.setColor(Color.RED);
        recPaint.setStrokeWidth(2);
        recPaint.setStyle(Paint.Style.STROKE);
        for (int e = 0; e < triangles.size(); e++){
            if (e < halfEdges.get(e)){
                canvas.drawRect(0, 0, 1000, 1000, recPaint);
                PointDouble p = circumcenters.get(triangleOfEdge(e));
                PointDouble q = circumcenters.get(triangleOfEdge(halfEdges.get(e)));
                if (/*!points.get(triangles.get(e)).isTunnel(triangles.get(halfEdges.get(e)))*/true){
                    canvas.drawLine((float) p.x * 5, (float) p.y * 5, (float) q.x * 5, (float) q.y * 5, mazePaint);
                    System.out.print(p.x * 5);
                    System.out.print(" ");
                    System.out.print(p.y * 5);
                    System.out.print(" ");
                    System.out.print(q.x * 5);
                    System.out.print(" ");
                    System.out.println(q.y * 5);

                }
            }
        }
        recPaint.setStrokeWidth(5);
        for (int i = 0; i < points.size(); i++){
            //canvas.drawPoints(new float[]{(float) (points.get(i).getPosition().x * 5), (float) (points.get(i).getPosition().y * 5)}, recPaint);
        }

        for (int i = 0; i < triangles.size() / 3; i++){
            drawTriangle(i, canvas);
        }
    }

    private int triangleOfEdge(int e){
        return e / 3;
    }

    private void drawTriangle(int t, Canvas canvas){
        PointDouble node1 = points.get(triangles.get(3 * t)).getPosition();
        PointDouble node2 = points.get(triangles.get(3 * t + 1)).getPosition();
        PointDouble node3 = points.get(triangles.get(3 * t + 2)).getPosition();
        Path mPath = new Path();
        mPath.moveTo((float) node1.x * 5, (float) node1.y * 5);
        mPath.lineTo((float) node2.x * 5, (float) node2.y * 5);
        mPath.lineTo((float) node3.x * 5, (float) node3.y * 5);
        mPath.close();

        Paint mPaint = new Paint();
        mPaint.setStrokeWidth(3);
        mPaint.setColor(Color.BLUE);
        mPaint.setStyle(Paint.Style.STROKE);
        //canvas.drawPath(mPath, mPaint);

    }
}
