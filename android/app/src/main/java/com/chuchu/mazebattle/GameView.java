package com.chuchu.mazebattle;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;

import com.chuchu.mazebattle.maze.Maze;
import com.chuchu.mazebattle.player.Player;

import java.util.ArrayList;
import java.util.zip.CheckedOutputStream;

public class GameView extends View {
    private float translateX;
    private float translateY;
    private int mazeInsideBackground;
    private int mazeWidth;
    private int mazeHeight;
    private Maze maze;
    private Player player;



    public GameView(Context context, @Nullable AttributeSet attrs){
        super(context, attrs);
        TypedArray styledAttributes = context.getTheme().obtainStyledAttributes(
                attrs,
                R.styleable.GameView,
                0, 0
        );
        try {
            mazeInsideBackground = styledAttributes.getColor(R.styleable.GameView_GV_mazeInsideBackground, Color.WHITE);
            mazeHeight = styledAttributes.getInteger(R.styleable.GameView_GV_mazeHeight, 200);
            mazeWidth = styledAttributes.getInteger(R.styleable.GameView_GV_mazeWidth, 200);

        } finally {
            styledAttributes.recycle();
        }
        translateX = 0;
        translateY = 0;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int cnt = canvas.save();

        canvas.translate(translateX, translateY);

        Paint recPaint = new Paint();
        recPaint.setColor(Color.BLACK);
        canvas.drawRect(-mazeWidth * 10, -mazeHeight * 10, mazeWidth * 30, mazeHeight * 30, recPaint);
        recPaint.setColor(mazeInsideBackground);
        canvas.drawRect(0, 0, mazeWidth * 20, mazeHeight * 20, recPaint);

        if(maze != null)
            maze.draw(canvas);

        showVisibleRegion(canvas, 400);
        canvas.restoreToCount(cnt);
    }



    public void setMaze(Maze maze){
        this.maze = maze;
    }

    public void setPlayer(Player player){
        this.player = player;
    }

    public void setTranslate(float translateX, float translateY) {
        this.translateX += translateX;
        this.translateY += translateY;
        invalidate();
    }

    public void showVisibleRegion(Canvas canvas, int regionRadios){
        Paint mPaintRegion = new Paint();

        int cnt = canvas.saveLayer(-mazeWidth * 10, -mazeHeight * 10, mazeWidth * 30, mazeHeight * 30, mPaintRegion);
        mPaintRegion.setColor(Color.BLACK);
        canvas.drawRect(-mazeWidth * 10, -mazeHeight * 10, mazeWidth * 30, mazeHeight * 30, mPaintRegion);
        mPaintRegion.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.XOR));
        canvas.drawCircle(getWidth() / 2 - translateX, getHeight() / 2 - translateY, regionRadios, mPaintRegion);
        mPaintRegion.setXfermode(null);
        mPaintRegion.setColor(Color.BLUE);
        canvas.drawCircle((float) getWidth() / 2 - translateX, (float) getHeight() / 2 - translateY, 25, mPaintRegion);

        canvas.restoreToCount(cnt);
    }
    public int getMazeWidth() {
        return mazeWidth;
    }

    public int getMazeHeight() {
        return mazeHeight;
    }
}
