package com.chuchu.mazebattle;

import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.chuchu.mazebattle.maze.Delaunay;
import com.chuchu.mazebattle.maze.Maze;
import com.chuchu.mazebattle.maze.PointDouble;
import com.chuchu.mazebattle.parser.Parser;
import com.chuchu.mazebattle.player.Player;


import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONArray;
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
import okhttp3.FormBody;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okhttp3.logging.HttpLoggingInterceptor;
import okio.ByteString;




public class MainActivity extends AppCompatActivity {
    private GameView gameView;
    private PlayerView playerView;
    private final HashMap<String, List<Cookie>> cookieStore = new HashMap<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_main);
        JoystickView joystick = findViewById(R.id.joystickView);
        playerView = findViewById(R.id.playerView);


        gameView = findViewById(R.id.gameView);
        Button btGet = findViewById(R.id.button_GET);
        Button btWebSocket = findViewById(R.id.button_WebSocket);
        /**傳送GET*/
        btGet.setOnClickListener(v -> {
            sendGET();
        });

        /**傳送WebSocket*/
        btWebSocket.setOnClickListener(v -> {
            sendWebSocket();
        });

        joystick.setOnMoveListener(new JoystickView.OnMoveListener() {
            @Override
            public void onMove(int angle, int strength) {
                if (strength != 0){
                    gameView.getPlayer().move((float) Math.cos(((double) angle / 180) * Math.PI) * 10, (float) -Math.sin(((double) angle / 180) * Math.PI) * 10);
                    gameView.invalidate();
                    playerView.move((float) Math.cos(((double) angle / 180) * Math.PI) * 10 >= 0? Player.RIGHT : Player.LEFT);
                }

            }

            @Override
            public void onStop(){
                playerView.stop();
            }
        });

        // set player in game view
        Player player = new Player(0, "chu", (float) 2.5, new PointDouble(0, 0));
        gameView.setPlayer(player);
        playerView.initPlayer(player);
    }

    private void sendGET() {
        //TextView tvRes = findViewById(R.id.text_Respond);
        /**建立連線*/
        OkHttpClient client = new OkHttpClient().newBuilder()
                .addInterceptor(new HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BASIC))
                .cookieJar(new CookieJar() {
                    @Override
                    public void saveFromResponse(@NotNull HttpUrl httpUrl, @NotNull List<Cookie> list) {
                        cookieStore.put(httpUrl.host(), list);
                    }

                    @NotNull
                    @Override
                    public List<Cookie> loadForRequest(@NotNull HttpUrl httpUrl) {
                        List<Cookie> cookies = cookieStore.get(httpUrl.host());
                        return cookies != null ? cookies : new ArrayList<Cookie>();
                    }
                })
                .build();
        /**設置傳送需求*/
        Request request = new Request.Builder()
                .url("http://192.168.1.101:5000/login")
                .header("Cookie","")//有Cookie需求的話則可用此發送
//                .addHeader("","")//如果API有需要header的則可使用此發送
                .build();
        /**設置回傳*/
        Call call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                /**如果傳送過程有發生錯誤*/
                //tvRes.setText(e.getMessage());
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                /**取得回傳*/

                System.out.println("login");

            }
        });

        /**設置傳送需求*/
        while (cookieStore.get("192.168.1.101") == null);
        request = new Request.Builder()
                .url("http://192.168.1.101:5000/gameinfo/0/200/200")
                .header("Cookie","")//有Cookie需求的話則可用此發送
//                .addHeader("","")//如果API有需要header的則可使用此發送
                .build();
        /**設置回傳*/
        call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                /**如果傳送過程有發生錯誤*/
                //tvRes.setText(e.getMessage());
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                /**取得回傳*/
                try {
                    //System.out.println(response.body().string());
                    JSONObject mazeInfo = new JSONObject(response.body().string()).getJSONObject("mazeInfo");
                    Maze maze = new Maze(Parser.vertexParser(mazeInfo.getJSONArray("vertexs")), Parser.edgeParser(mazeInfo.getJSONArray("edges")), gameView.getMazeWidth(), gameView.getMazeHeight());
                    gameView.setMaze(maze);

                    gameView.invalidate();
                    //tvRes.setText("GET回傳：\n" + grids);
                } catch (JSONException e) {
                    e.printStackTrace();
                    System.out.println(e);
                }

            }
        });
    }


    private void sendWebSocket() {
        //EditText edWebSocket = findViewById(R.id.editText_WebSocket);
        //TextView tvRes = findViewById(R.id.text_Respond);
        /**設置傳送需求*/
        Request request = new Request.Builder()
                .url("wss://echo.websocket.org")
                .build();
        /**建立連線*/
        OkHttpClient client = new OkHttpClient().newBuilder()
                .addInterceptor(new HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BASIC))
                .build();
        /**設置WebSocket監聽器*/
        client.newWebSocket(request, new WebSocketListener() {
            /**回傳WebSocket已關閉時做的事情*/
            @Override
            public void onClosed(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
                super.onClosed(webSocket, code, reason);
            }

            /**回傳WebSocket關閉時所做的事情*/
            @Override
            public void onClosing(@NotNull WebSocket webSocket, int code, @NotNull String reason) {
                super.onClosing(webSocket, code, reason);
            }

            /**回傳WebSocket連線失敗時的回傳*/
            @Override
            public void onFailure(@NotNull WebSocket webSocket, @NotNull Throwable t, @Nullable Response response) {
                super.onFailure(webSocket, t, response);
                //tvRes.setText("WebSocket回傳(錯誤)：\n" + response + "\n" + t);
            }

            /**回傳WebSocket取得到的String回傳*/
            @Override
            public void onMessage(@NotNull WebSocket webSocket, @NotNull String text) {
                super.onMessage(webSocket, text);
                //tvRes.setText("WebSocket回傳：\n" + text);
            }

            /**回傳WebSocket取得到的ByteArray回傳*/
            @Override
            public void onMessage(@NotNull WebSocket webSocket, @NotNull ByteString bytes) {
                super.onMessage(webSocket, bytes);
            }

            /**回傳WebSocket開始時所需做的動作*/
            @Override
            public void onOpen(@NotNull WebSocket webSocket, @NotNull Response response) {
                super.onOpen(webSocket, response);
                //webSocket.send(edWebSocket.getText().toString());
//                webSocket.cancel();//想斷開連線的話請加這行

            }
        });
        /**清除並關閉執行緒*/
        client.dispatcher().executorService().shutdown();
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
