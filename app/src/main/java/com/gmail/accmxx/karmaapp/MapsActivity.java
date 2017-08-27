package com.gmail.accmxx.karmaapp;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

public class MapsActivity extends FragmentActivity
        implements OnMapReadyCallback,GoogleMap.OnMarkerClickListener {

    public static boolean initialized = false;

    private static final int MY_PERMISSIONS_REQUEST_GPS = 1;

    private Marker markerIdeas, markerCharger, markerTokens, markerKitchen;
    private GoogleMap mMap;
    MarkerOptions mMapMarker = new MarkerOptions();

    LocationManager locationManager;

    private static final String LOG_TAG = "PlaceSelectionListener";
    float ZOOM = 18;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        initialized = false;

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        //REQUEST PERMISSIONS
        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(MapsActivity.this, new String[]
                    {Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.ACCESS_FINE_LOCATION},MY_PERMISSIONS_REQUEST_GPS);

            return;
        }

        if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, new LocationListener() {

                @Override
                public void onLocationChanged(Location location) {
                    double lat = location.getLatitude();
                    double lng = location.getLongitude();
                    if(!initialized) {
                        goToLocationZoom(lat, lng, ZOOM);
                        initialized = true;
                    }
                }

                @Override
                public void onStatusChanged(String s, int i, Bundle bundle) {

                }

                @Override
                public void onProviderEnabled(String s) {

                }

                @Override
                public void onProviderDisabled(String s) {
                    Toast.makeText(MapsActivity.this, "Cannot Find GPS Data",Toast.LENGTH_LONG).show();
                }
            });
        } else if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, new LocationListener() {

                @Override
                public void onLocationChanged(Location location) {
                    double lat = location.getLatitude();
                    double lng = location.getLongitude();
                    if(!initialized) {
                        goToLocationZoom(lat, lng, ZOOM);
                        initialized = true;
                    }
                }

                @Override
                public void onStatusChanged(String s, int i, Bundle bundle) {

                }

                @Override
                public void onProviderEnabled(String s) {

                }

                @Override
                public void onProviderDisabled(String s) {
                    Toast.makeText(MapsActivity.this, "Cannot Find GPS Data",Toast.LENGTH_LONG).show();
                }
            });
        }
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        locationManager = (LocationManager)this.getSystemService(LOCATION_SERVICE);

        if ((ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) ||
                ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            mMap.setMyLocationEnabled(true);
        }

        markerIdeas = googleMap.addMarker(new MarkerOptions()
                .position(new LatLng(43.6592173,-79.4153541))
                .title("Water Plants")
                .snippet("Please Water my plants ($8.5)"));
        markerIdeas = googleMap.addMarker(new MarkerOptions()
                .position(new LatLng(43.6632012,-79.4106093))
                .title("Bring Flashlight")
                .snippet("Bring me flashlight ($3)"));
        markerIdeas.showInfoWindow();
        markerTokens = googleMap.addMarker(new MarkerOptions()
                .position(new LatLng(43.6554424,-79.3954466))
                .title("Bring Burrito")
                .snippet("3 K-Points ($7.5)"));
        markerTokens = googleMap.addMarker(new MarkerOptions()
                .position(new LatLng(43.663283,-79.4111655))
                .title("Need Tokens")
                .snippet("I need some TTC Tokens ($2)"));
        markerKitchen = googleMap.addMarker(new MarkerOptions()
                .position(new LatLng(43.662942,-79.4113911))
                .title("Kitchen Help")
                .snippet("Cleaning and dishwasher ($30)"));
        markerCharger = googleMap.addMarker(new MarkerOptions()
                .position(new LatLng(43.662648,-79.410145))
                .title("Need a Charger")
                .snippet("Need one fast ($1)"));

    //    googleMap.setOnMarkerClickListener(this);
    }

    private void goToLocationZoom(double lat, double lng, float zoom) {
        LatLng ll = new LatLng(lat, lng);
        CameraUpdate update = CameraUpdateFactory.newLatLngZoom(ll, zoom);

        mMapMarker.position(ll);
        mMap.moveCamera(update);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_GPS: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    finish();
                    startActivity(getIntent());

                } else {
                    finish();
                }
                return;
            }
        }
    }


    @Override
    public boolean onMarkerClick(Marker marker) {

        if(marker.getTitle().equals("Kitchen Help")){
            Intent intent = new Intent(getApplicationContext(), FavorDetailsActivity.class);
            startActivity(intent);
        }
        return true;
    }
}

