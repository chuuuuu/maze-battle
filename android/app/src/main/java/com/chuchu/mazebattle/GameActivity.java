package com.chuchu.mazebattle;

import android.os.Bundle;
import android.view.WindowManager;
import android.widget.Button;


import androidx.appcompat.app.AppCompatActivity;

import com.chuchu.mazebattle.apollo.Apollo;
import com.chuchu.mazebattle.maze.Maze;
import com.chuchu.mazebattle.maze.PointDouble;
import com.chuchu.mazebattle.parser.Parser;
import com.chuchu.mazebattle.player.Player;


import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okhttp3.logging.HttpLoggingInterceptor;
import okio.ByteString;




public class GameActivity extends AppCompatActivity {
    private Maze maze;
    private GameView gameView;
    private PlayerView playerView;
    private final HashMap<String, List<Cookie>> cookieStore = new HashMap<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_game);
        JoystickView joystick = findViewById(R.id.joystickView);
        playerView = findViewById(R.id.playerView);


        gameView = findViewById(R.id.gameView);


        joystick.setOnMoveListener(new JoystickView.OnMoveListener() {
            @Override
            public void onMove(int angle, int strength) {
                float accelerate = (float) strength / 100;
                if (strength != 0){
                    gameView.getPlayer().move((float) Math.cos(((double) angle / 180) * Math.PI) * 10 * accelerate, (float) -Math.sin(((double) angle / 180) * Math.PI) * 10 * accelerate);
                    gameView.invalidate();
                    playerView.move((float) Math.cos(((double) angle / 180) * Math.PI) * 10 * accelerate >= 0? Player.RIGHT : Player.LEFT);
                }

            }

            @Override
            public void onStop(){
                playerView.stop();
            }
        });

        // set player in game view
        Player player = new Player(0, "chu", (float) 3.5, new PointDouble(0, 0));
        gameView.setPlayer(player);
        playerView.initPlayer(player);

        maze = new Maze(null, null, gameView.getMazeWidth(), gameView.getMazeHeight());
        Apollo.initMaze(maze);
        while(maze.getEdges() == null);
        gameView.setMaze(maze);
        gameView.invalidate();


    }

    @Override
    protected void onResume() {
        super.onResume();
        playerView.resume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        playerView.pause();
    }
}
