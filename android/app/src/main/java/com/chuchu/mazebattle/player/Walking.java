package com.chuchu.mazebattle.player;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Rect;
import android.graphics.RectF;

import com.chuchu.mazebattle.R;

import java.util.ArrayList;

public class Walking implements State{
    private final int frameCount = 12;
    private final int frameWidth = 230, frameHeight = 274;
    private ArrayList<Bitmap> walkingBitmap;
    private ArrayList<Bitmap> mirrored;
    private int currentFrame;
    private Player player;
    private RectF whereToDraw;

    public Walking(ArrayList<Bitmap> walkingBitmap, Player player){
        this.walkingBitmap = walkingBitmap;
        this.player = player;
        this.currentFrame = -1;
        createMirrored();
        whereToDraw = new RectF(0, 0, frameWidth, frameHeight);
    }
    @Override
    public void draw(Canvas canvas) {
        if (currentFrame == -1) return;
        if (player.getFace() == Player.RIGHT) {
            canvas.drawBitmap(walkingBitmap.get(currentFrame), null, whereToDraw, null);
        } else {
            canvas.drawBitmap(mirrored.get(currentFrame), null, whereToDraw, null);
        }

    }

    @Override
    public void update() {
        currentFrame++;
        if (currentFrame >= frameCount) currentFrame = 0;
    }


    private void createMirrored(){
        mirrored = new ArrayList<>();
        Matrix m = new Matrix();
        m.preScale(-1, 1);
        Bitmap bitmap;
        for (int i = 0; i < walkingBitmap.size(); i++){
            bitmap = Bitmap.createBitmap(walkingBitmap.get(i), 0, 0, walkingBitmap.get(i).getWidth(), walkingBitmap.get(i).getHeight(), m, true);
            mirrored.add(bitmap);
        }
    }


}
