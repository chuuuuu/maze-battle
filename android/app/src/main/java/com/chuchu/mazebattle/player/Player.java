package com.chuchu.mazebattle.player;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.chuchu.mazebattle.Drawable;
import com.chuchu.mazebattle.maze.Node;
import com.chuchu.mazebattle.maze.PointDouble;

public class Player implements Drawable {
    private int userId;
    private String userName;
    private float velocity;
    private PointDouble position;
    public static final int RIGHT = 0;
    public static final int LEFT = 1;
    private int face;



    public Player(int userId, String userName, float velocity, PointDouble initPosition) {
        this.userId = userId;
        this.userName = userName;
        this.velocity = velocity;  //2.5
        this.position = initPosition;
        this.face = RIGHT;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setVelocity(float velocity) {
        this.velocity = velocity;
    }

    public float getVelocity() {
        return velocity;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public PointDouble getPosition() {
        return position;
    }

    public void move(float x, float y){
        position.x += x * velocity;
        position.y += y * velocity;

    }


    @Override
    public void draw(Canvas canvas) {
        Paint mPaint = new Paint();
        mPaint.setColor(Color.BLUE);
        canvas.drawCircle((float) position.x, (float) position.y, 25, mPaint);
    }

    public int getFace() {
        return face;
    }

    public void setFace(int face) {
        this.face = face;
    }


}
