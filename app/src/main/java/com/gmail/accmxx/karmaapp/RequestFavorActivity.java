package com.gmail.accmxx.karmaapp;


import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;

import com.google.android.gms.location.places.Place;
import com.google.android.gms.location.places.ui.PlacePicker;

public class RequestFavorActivity extends AppCompatActivity {

    private int PLACE_PICKER_REQUEST=1;
    private RelativeLayout mPlaceBox;
    public TextView mPlaceAddress;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_request_favor);

        mPlaceBox = (RelativeLayout) findViewById(R.id.place_view_box);
        mPlaceAddress = (TextView) findViewById(R.id.place_address);

        Spinner spinner = (Spinner) findViewById(R.id.spinner_time_select);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.time_array, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);

        mPlaceBox.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                PLACE_PICKER_REQUEST = 2;
                MapPlacePicker(view);
            }
        });

    }

    public void MapPlacePicker(View view){
        PlacePicker.IntentBuilder intentBuilder = new PlacePicker.IntentBuilder();
        try {
            Intent intent = intentBuilder.build(this);
            startActivityForResult(intent,PLACE_PICKER_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == PLACE_PICKER_REQUEST && resultCode == RESULT_OK) {
            Place place = PlacePicker.getPlace(this, data);
            String placeString = place.getAddress().toString();
            mPlaceAddress.setText(placeString);
        }

    }

}