package com.chuchu.mazebattle;

import android.content.Intent;
import android.os.Bundle;

import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;


import androidx.appcompat.app.AppCompatActivity;

import com.chuchu.mazebattle.apollo.Apollo;


public class MainActivity extends AppCompatActivity {
    private EditText et_username;
    private Button btn_login;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_main);

        et_username = findViewById(R.id.et_username);
        btn_login = findViewById(R.id.btn_login);

        btn_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Apollo.login(et_username.getText().toString());
                while(!Apollo.ownCookie());
                Intent intent = new Intent(v.getContext(), LobbyActivity.class);
                startActivity(intent);
            }
        });



    }


}
