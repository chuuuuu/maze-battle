package com.chuchu.mazebattle.player;

import android.graphics.Canvas;

public class WaitingPerFrame implements State{
    private final State state;
    private final long waitingLoopPerFrame;
    private long remaining;

    public WaitingPerFrame(long waitingLoopPerFrame, State state) {
        this.remaining = this.waitingLoopPerFrame = waitingLoopPerFrame;
        this.state = state;
    }

    @Override
    public void draw(Canvas canvas) {
        state.draw(canvas);
    }

    @Override
    public void update() {
        if (--remaining <= 0) {
            remaining = waitingLoopPerFrame;
            state.update();
        }
    }

    @Override
    public String toString() {
        return state.toString();
    }
}
