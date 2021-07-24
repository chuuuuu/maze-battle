package com.chuchu.mazebattle.player;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.RectF;

public class Idle implements State{
    private Bitmap idleBitmap;
    private Bitmap mirrored;
    private final int frameWidth = 230, frameHeight = 274;
    private Player player;
    private RectF whereToDraw;
    public Idle(Bitmap idleBitmap, Player player){
        this.idleBitmap = idleBitmap;
        this.player = player;
        whereToDraw = new RectF(0, 0, frameWidth, frameHeight);
        createMirrored();
    }

    @Override
    public void draw(Canvas canvas) {
        if (player.getFace() == Player.RIGHT){
            canvas.drawBitmap(idleBitmap, null, whereToDraw, null);
        } else {
            canvas.drawBitmap(mirrored, null, whereToDraw, null);
        }
    }

    @Override
    public void update() {

    }

    private void createMirrored(){
        Matrix m = new Matrix();
        m.preScale(-1, 1);
        mirrored = Bitmap.createBitmap(idleBitmap, 0, 0, idleBitmap.getWidth(), idleBitmap.getHeight(), m, true);
    }
}
