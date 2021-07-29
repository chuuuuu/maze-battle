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
import com.chuchu.mazebattle.maze.PointDouble;
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

    public Player getPlayer() {
        return player;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        int cnt = canvas.save();

        canvas.translate((float) (getWidth() / 2 - getPlayer().getPosition().x), (float) (getHeight() / 2 - getPlayer().getPosition().y));

        Paint recPaint = new Paint();
        recPaint.setColor(Color.BLACK);
        canvas.drawRect(-mazeWidth * 10, -mazeHeight * 10, mazeWidth * 30, mazeHeight * 30, recPaint);
        recPaint.setColor(mazeInsideBackground);
        canvas.drawRect(0, 0, mazeWidth * 20, mazeHeight * 20, recPaint);

        if (maze != null)
            maze.draw(canvas);

        /*if (player != null)
            player.draw(canvas);*/



        showVisibleRegion(canvas, 500);
        canvas.restoreToCount(cnt);
    }



    public void setMaze(Maze maze){
        this.maze = maze;
    }

    public void setPlayer(Player player){
        this.player = player;
    }



    public void showVisibleRegion(Canvas canvas, int regionRadios){
        Paint mPaintRegion = new Paint();
        PointDouble playerPosition = getPlayer().getPosition();

        //int cnt = canvas.saveLayer(-mazeWidth * 10, -mazeHeight * 10, mazeWidth * 30, mazeHeight * 30, mPaintRegion);
        int cnt = canvas.saveLayer((float) playerPosition.x - getWidth() / 2, (float) playerPosition.y - getHeight() / 2, (float) playerPosition.x + getWidth() / 2, (float) playerPosition.y + getHeight() / 2, mPaintRegion);
        mPaintRegion.setColor(Color.BLACK);
        canvas.drawRect((float) playerPosition.x - getWidth() / 2, (float) playerPosition.y - getHeight() / 2, (float) playerPosition.x + getWidth() / 2, (float) playerPosition.y + getHeight() / 2, mPaintRegion);
        mPaintRegion.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.XOR));
        canvas.drawCircle((float) playerPosition.x, (float) playerPosition.y, regionRadios, mPaintRegion);
        mPaintRegion.setXfermode(null);

        canvas.restoreToCount(cnt);
    }
    public int getMazeWidth() {
        return mazeWidth;
    }

    public int getMazeHeight() {
        return mazeHeight;
    }
}
