package com.chuchu.mazebattle.player;

import android.graphics.Canvas;

public interface State {
    void draw(Canvas canvas);
    void update();
}
