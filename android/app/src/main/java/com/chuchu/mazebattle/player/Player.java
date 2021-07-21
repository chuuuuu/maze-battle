package com.chuchu.mazebattle.player;

import android.graphics.Canvas;

import com.chuchu.mazebattle.Drawable;
import com.chuchu.mazebattle.maze.Node;
import com.chuchu.mazebattle.maze.PointDouble;

public class Player implements Drawable {
    private int userId;
    private String userName;
    private int velocity;
    private PointDouble position;

    public Player(int userId, String userName, int velocity, PointDouble initPosition) {
        this.userId = userId;
        this.userName = userName;
        this.velocity = velocity;
        this.position = initPosition;

    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setVelocity(int velocity) {
        this.velocity = velocity;
    }

    public int getVelocity() {
        return velocity;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }


    @Override
    public void draw(Canvas canvas) {

    }
}
