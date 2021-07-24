package com.chuchu.mazebattle;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;

import androidx.annotation.Nullable;

import com.chuchu.mazebattle.player.Idle;
import com.chuchu.mazebattle.player.Player;
import com.chuchu.mazebattle.player.State;
import com.chuchu.mazebattle.player.WaitingPerFrame;
import com.chuchu.mazebattle.player.Walking;

import java.util.ArrayList;


public class PlayerView extends View implements Runnable{
    private Thread gameThread;
    private volatile boolean playing;
    private ArrayList<Bitmap> walkingBitmap;
    private Bitmap idleBitmap;
    private boolean isMoving;
    private Player player;
    private int frameCount = 12;
    private int frameWidth = 230, frameHeight = 274;
    private State walking;
    private State idle;
    private State currentState;
    public PlayerView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);

    }

    @Override
    public void run() {
        while (playing) {
            update();
            invalidate();
            try {
                Thread.sleep(60);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void update() {
        currentState.update();
    }


    public void onDraw(Canvas canvas) {
        canvas.drawColor(getResources().getColor(R.color.white_0));
        currentState.draw(canvas);
    }

    public void pause() {
        playing = false;

        try {
            gameThread.join();
        } catch(InterruptedException e) {
            Log.e("ERR", "Joining Thread");
        }
    }

    public void resume() {
        playing = true;
        gameThread = new Thread(this);
        gameThread.start();
    }

    public void move(int face){
        currentState = walking;
        player.setFace(face);
    }

    public void stop(){
        currentState = idle;
    }

    public void initPlayer(Player player){
        this.player = player;
        walkingBitmap = new ArrayList<>();
        for (int i = 0; i < frameCount; i++){
            String imageName = "player_walking" + i;
            int id = getResources().getIdentifier(imageName, "drawable", getContext().getPackageName());
            Bitmap bitmap = BitmapFactory.decodeResource(getResources(), id);
            bitmap = Bitmap.createScaledBitmap(bitmap, frameWidth, frameHeight, false);
            walkingBitmap.add(bitmap);
        }
        idleBitmap = BitmapFactory.decodeResource(getResources(), R.drawable.player_idle);
        idleBitmap = Bitmap.createScaledBitmap(idleBitmap, frameWidth, frameHeight, false);

        walking = new WaitingPerFrame(1, new Walking(walkingBitmap, player));
        idle = new WaitingPerFrame(1, new Idle(idleBitmap, player));
        currentState = idle;

    }

    public Player getPlayer() {
        return player;
    }
}
