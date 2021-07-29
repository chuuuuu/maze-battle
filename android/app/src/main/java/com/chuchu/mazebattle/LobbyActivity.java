package com.chuchu.mazebattle;


import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.chuchu.mazebattle.apollo.Apollo;
import com.chuchu.mazebattle.apollo.ApolloAI;
import com.chuchu.mazebattle.callback.Callback;
import com.chuchu.mazebattle.type.MAZENAME;


public class LobbyActivity extends AppCompatActivity {
    private Button btn_create_room;
    private Button btn_create;
    private LinearLayout ll_create_room;
    private LinearLayout ll_join_room;
    private CheckBox cb_maze_noob;
    private ImageView img_maze_noob;
    private EditText et_password_create;
    private Button btn_join_room;
    private Button btn_join;
    private EditText et_password_join;
    private EditText et_roomId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_lobby);

        btn_create_room = findViewById(R.id.btn_create_room);
        btn_create = findViewById(R.id.btn_create);
        ll_create_room = findViewById(R.id.ll_createRoomPanel);
        img_maze_noob = findViewById(R.id.img_maze_noob);
        cb_maze_noob = findViewById(R.id.cb_noob);
        et_password_create = findViewById(R.id.et_password_create);
        et_password_join = findViewById(R.id.et_password_join);
        btn_join_room = findViewById(R.id.btn_fast_join);
        btn_join = findViewById(R.id.btn_join);
        ll_join_room = findViewById(R.id.ll_joinRoomPanel);
        et_roomId = findViewById(R.id.et_roomId);

        btn_create_room.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("click create room");
                ll_create_room.setVisibility(View.VISIBLE);
                ll_create_room.animate().translationY(1000).setDuration(0).start();
                ll_create_room
                        .animate()
                        .translationY(30)
                        .setDuration(500)
                        .start();
            }
        });

        img_maze_noob.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                cb_maze_noob.setChecked(true);
            }
        });

        btn_create.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(cb_maze_noob.isChecked() == true){
                    Apollo.createRoom(MAZENAME.NOOB, et_password_create.getText().toString(), "A1", new Callback() {
                        @Override
                        public void onCall() {
                            ApolloAI.joinRoom("0000", 0, new Callback() {
                                @Override
                                public void onCall() {
                                    Apollo.startGame();
                                    Intent intent = new Intent(v.getContext(), GameActivity.class);
                                    startActivity(intent);
                                }
                            });
                        }
                    });
                }
            }
        });

        btn_join_room.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("click fast join");
                ll_join_room.setVisibility(View.VISIBLE);
                ll_join_room.animate().translationY(1000).setDuration(0).start();
                ll_join_room
                        .animate()
                        .translationY(30)
                        .setDuration(500)
                        .start();
            }
        });

        btn_join.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ApolloAI.createRoom(MAZENAME.NOOB, "0000", "B1", new Callback() {
                    @Override
                    public void onCall() {
                        Apollo.joinRoom(et_password_join.getText().toString(), Double.parseDouble(et_roomId.getText().toString()), new Callback() {
                            @Override
                            public void onCall() {
                                ApolloAI.startGame();
                                Intent intent = new Intent(v.getContext(), GameActivity.class);
                                startActivity(intent);
                            }
                        });
                    }
                });
            }
        });

        ApolloAI.login("teresa");


    }


}