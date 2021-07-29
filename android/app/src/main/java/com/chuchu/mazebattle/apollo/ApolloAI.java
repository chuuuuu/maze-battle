package com.chuchu.mazebattle.apollo;

import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.ApolloClient;
import com.apollographql.apollo.exception.ApolloException;
import com.chuchu.mazebattle.CreateRoomMutation;
import com.chuchu.mazebattle.JoinRoomMutation;
import com.chuchu.mazebattle.LoginMutation;
import com.chuchu.mazebattle.MazeInfoQuery;
import com.chuchu.mazebattle.StartGameMutation;
import com.chuchu.mazebattle.UserInfoQuery;
import com.chuchu.mazebattle.callback.Callback;
import com.chuchu.mazebattle.maze.Maze;
import com.chuchu.mazebattle.parser.Parser;
import com.chuchu.mazebattle.player.Player;
import com.chuchu.mazebattle.type.MAZENAME;

import org.jetbrains.annotations.NotNull;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;

public class ApolloAI {
    public static final HashMap<String, List<Cookie>> cookieStore = new HashMap<>();
    private static final OkHttpClient okHttpClient = new OkHttpClient().newBuilder()
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
            .addInterceptor(new Interceptor() {
                @Override
                public Response intercept(Interceptor.Chain chain) throws IOException {
                    return chain.proceed(chain.request().newBuilder().header("Cookie", "").build());
                }
            })
            .build();
    public static final ApolloClient apolloClient = ApolloClient.builder()
            .serverUrl("http://192.168.1.101:4321/graphql")
            .okHttpClient(okHttpClient)
            .build();;

    public static void login(String username){
        apolloClient.mutate(LoginMutation.builder()
                .username(username)
                .build())
                .enqueue(new ApolloCall.Callback<LoginMutation.Data>() {

                    @Override
                    public void onResponse(@NotNull com.apollographql.apollo.api.Response<LoginMutation.Data> response) {
                        System.out.println("Login successfully :" + response.getData().login().user().username());
                    }

                    @Override
                    public void onFailure(@NotNull ApolloException e) {
                        System.out.println(e);
                    }
                });
    }

    public static void getUserPosition(Player me){
        apolloClient.query(UserInfoQuery.builder()
                .build())
                .enqueue(new ApolloCall.Callback<UserInfoQuery.Data>() {

                    @Override
                    public void onResponse(@NotNull com.apollographql.apollo.api.Response<UserInfoQuery.Data> response) {
                        me.getPosition().x = response.getData().me().position().x();
                        me.getPosition().y = response.getData().me().position().y();
                    }

                    @Override
                    public void onFailure(@NotNull ApolloException e) {
                        System.out.println(e);
                    }
                });
    }

    public static Boolean ownCookie(){
        return cookieStore.get("192.168.1.101") != null;
    }

    public static void createRoom(MAZENAME mapName, String password, String roomName, Callback callback){
        apolloClient.mutate(CreateRoomMutation.builder()
                .mapname(mapName)
                .password(password)
                .roomname(roomName)
                .build())
                .enqueue(new ApolloCall.Callback<CreateRoomMutation.Data>() {
                    @Override
                    public void onResponse(@NotNull com.apollographql.apollo.api.Response<CreateRoomMutation.Data> response) {
                        System.out.println("Create room with room id : " + response.getData().createRoom().room().id() + " successfully");
                        callback.onCall();
                    }

                    @Override
                    public void onFailure(@NotNull ApolloException e) {
                        System.out.println(e);
                    }
                });
    }

    public static void startGame(){
        apolloClient.mutate(StartGameMutation.builder()
                .build())
                .enqueue(new ApolloCall.Callback<StartGameMutation.Data>() {

                    @Override
                    public void onResponse(@NotNull com.apollographql.apollo.api.Response<StartGameMutation.Data> response) {
                        System.out.println("Start game with room id : " + response.getData().startGame().room().id() + " successfully");
                    }

                    @Override
                    public void onFailure(@NotNull ApolloException e) {
                        System.out.println(e);
                    }
                });
    }

    public static void initMaze(Maze maze){
        apolloClient.query(MazeInfoQuery.builder()
                .build())
                .enqueue(new ApolloCall.Callback<MazeInfoQuery.Data>() {

                    @Override
                    public void onResponse(@NotNull com.apollographql.apollo.api.Response<MazeInfoQuery.Data> response) {
                        try {
                            JSONObject mazeInfo = new JSONObject(response.getData().me().room().maze().mazeMap().edges().toString());
                            maze.setEdges(Parser.edgeParser(mazeInfo.getJSONArray("edges")));
                            maze.setVertices(Parser.vertexParser(mazeInfo.getJSONArray("vertexs")));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onFailure(@NotNull ApolloException e) {
                        System.out.println(e);
                    }
                });
    }

    public static void joinRoom(String password, double roomId, Callback callback){
        apolloClient.mutate(JoinRoomMutation.builder()
                .password(password)
                .roomid(roomId)
                .build())
                .enqueue(new ApolloCall.Callback<JoinRoomMutation.Data>() {

                    @Override
                    public void onResponse(@NotNull com.apollographql.apollo.api.Response<JoinRoomMutation.Data> response) {
                        System.out.println("Join room with room id : " + response.getData().joinRoom().room().id() + " successfully");
                        callback.onCall();
                    }

                    @Override
                    public void onFailure(@NotNull ApolloException e) {
                        System.out.println(e);
                    }
                });

    }
}
