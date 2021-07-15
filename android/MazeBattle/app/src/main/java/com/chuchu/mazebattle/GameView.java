package com.chuchu.mazebattle;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;

import java.util.ArrayList;

public class GameView extends View {
    private ArrayList<Drawable> elements;
    public GameView(Context context, @Nullable AttributeSet attrs){
        super(context, attrs);
        elements = new ArrayList<>();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        for (Drawable element: elements) {
            element.draw(canvas);
        }
    }

    public void addElements(Drawable element){
        elements.add(element);
    }
}
