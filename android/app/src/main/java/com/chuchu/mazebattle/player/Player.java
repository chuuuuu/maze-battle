package com.chuchu.mazebattle.player;

import com.chuchu.mazebattle.maze.Node;

public class Player {
    private int userId;
    private String userName;
    private Node room;

    public Player(int userId, String userName, Node room) {
        this.userId = userId;
        this.userName = userName;
        this.room = room;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Node getRoom() {
        return room;
    }

    public void setRoom(Node room) {
        this.room = room;
    }
}
