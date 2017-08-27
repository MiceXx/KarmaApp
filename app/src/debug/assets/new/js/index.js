'use strict';

$(document).ready(function() {

  var animating = false;
  var step1 = 500;
  var step2 = 500;
  var step3 = 500;
  var reqStep1 = 600;
  var reqStep2 = 800;
  var reqClosingStep1 = 500;
  var reqClosingStep2 = 500;
  var $scrollCont = $(".phone__scroll-cont");

  function initMap($card, i) {
    // my first experience with google maps api, so I have no idea what I'm doing
    var latLngFrom = {lat: delivcardDefaultData[i].latFrom, lng: delivcardDefaultData[i].lngFrom};
    var latLngTo = {lat: delivcardDefaultData[i].latTo, lng: delivcardDefaultData[i].lngTo};
    var latLngCenter = {
      lat: (latLngFrom.lat + latLngTo.lat)/2,
      lng: (latLngFrom.lng + latLngTo.lng)/2
    };
    var themeColor = $card.data("color");

    var map = new google.maps.Map($(".card__map__inner", $card)[0], {
      zoom: 12,
      center: latLngCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    });

    map.set('styles', [
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          { "hue": "#00ffdd" },
          { "gamma": 1 },
          { "lightness": 0 }
        ]
      },{
        "featureType": "road",
        "stylers": [
          { "lightness": 0 },
          { "hue": "#006eff" }
        ]
      }
    ]);

    var pinImage = new google.maps.MarkerImage(
      "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + themeColor.slice(1),
      new google.maps.Size(21, 34),
      new google.maps.Point(0,0),
      new google.maps.Point(10, 34)
    );

    var marker = new google.maps.Marker({
      position: latLngFrom,
      map: map,
      title: 'From',
      icon: pinImage
    });

    var marker = new google.maps.Marker({
      position: latLngTo,
      map: map,
      title: 'To',
      icon: pinImage
    });

    var polylineOpts = new google.maps.Polyline({
      strokeColor: themeColor,
      strokeWeight: 3
    });
    var rendererOptions = {map: map, polylineOptions: polylineOpts, suppressMarkers: true};
    var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    var request = {
      origin: latLngFrom,
      destination: latLngTo,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
      else {
        console.log("wtf")
      }
    });
  };

  //initMap($(".card"));



  $(document).on("click", ".card:not(.active)", function() {
    if (animating) return;
    animating = true;

    var $card = $(this);
    var cardTop = $card.position().top;
    var scrollTopVal = cardTop - 30;
    $card.addClass("flip-step1 active");

    $scrollCont.animate({scrollTop: scrollTopVal}, step1);

    setTimeout(function() {
      $scrollCont.animate({scrollTop: scrollTopVal}, step2);
      $card.addClass("flip-step2");

      setTimeout(function() {
        $scrollCont.animate({scrollTop: scrollTopVal}, step3);
        $card.addClass("flip-step3");

        setTimeout(function() {
          animating = false;
        }, step3);

      }, step2*0.5);

    }, step1*0.65);
  });

  $(document).on("click", ".card:not(.req-active1) .card__header__close-btn", function() {
    if (animating) return;
    animating = true;

    var $card = $(this).parents(".card");
    $card.removeClass("flip-step3 active");

    setTimeout(function() {
      $card.removeClass("flip-step2");

      setTimeout(function() {
        $card.removeClass("flip-step1");

        setTimeout(function() {
          animating = false;
        }, step1);

      }, step2*0.65);

    }, step3/2);
  });

  $(document).on("click", ".card:not(.req-active1) .card__request-btn", function(e) {
    if (animating) return;
    animating = true;

    var $card = $(this).parents(".card");
    var cardTop = $card.position().top;
    var scrollTopVal = cardTop - 30;

    $card.addClass("req-active1 map-active");


    if(angular.element($card).hasClass('number-1')){
      initMap($card, 1);
    }else if(angular.element($card).hasClass('number-2')){
      initMap($card, 2);
    }else if(angular.element($card).hasClass('number-3')){
      initMap($card, 3);
    }else if(angular.element($card).hasClass('number-4')){
      initMap($card, 4);
    }
    else if(angular.element($card).hasClass('number-5')){
      initMap($card, 5);
    }


    setTimeout(function() {
      $card.addClass("req-active2");
      $scrollCont.animate({scrollTop: scrollTopVal}, reqStep2);

      setTimeout(function() {
        animating = false;
      }, reqStep2);

    }, reqStep1);
  });






  $(document).on("click",
                 ".card.req-active1 .card__header__close-btn, .card.req-active1 .card__request-btn",
                 function() {
    if (animating) return;
    animating = true;

    var $card = $(this).parents(".card");

    $card.addClass("req-closing1");

    setTimeout(function() {
      $card.addClass("req-closing2");

      setTimeout(function() {
        $card.addClass("no-transition hidden-hack")
        $card.css("top");
        $card.removeClass("req-closing2 req-closing1 req-active2 req-active1 map-active flip-step3 flip-step2 flip-step1 active");
        $card.css("top");
        $card.removeClass("no-transition hidden-hack");
        animating = false;
      }, reqClosingStep2);

    }, reqClosingStep1);
  });

});

// angular used only for templating, I was too tired to find more lightweight solution

var delivcardDefaultData = [
  {id: 'Bring Flashlight', price: 3, requests: '--', pledge: 3, weight: 50, favortext: 'Mark as done',
   sender: 'Ivan Pan', senderImg: 'http://i.imgur.com/szrgXb2.jpg', number: 0,
   themeColor: 'green', themeColorHex: '#52A43A', latFrom: 43.663242, lngFrom: -79.410690, latTo: 43.659266, lngTo: -79.413080,
   bgImgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/deliv-7.jpg', rating: 5, ratingCount: 26,
   fromStreet: 'Waiting for replies', fromCity: '',
   toStreet: '720 Bathurst St', toCity: 'Toronto, ON M5S 2R4',
   delivTime: 'Bring me flashlight', delivDate: 'May 16, 2015', delivDateNoun: 'Today',
   reqDl: '24 minutes', delivImg: 'http://i.imgur.com/szrgXb2.jpg', deliv: 'Ivan Pan'},
  {id: 'Water Plants', price: 8.5, requests: 0.3, pledge: 8.5, weight: 50, favortext: 'Do Favor',
   sender: 'Ivan Pan', senderImg: 'http://i.imgur.com/szrgXb2.jpg', number: 1,
   themeColor: 'green', themeColorHex: '#52A43A', latFrom: 43.663242, lngFrom: -79.410690, latTo: 43.659266, lngTo: -79.413080,
   bgImgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/deliv-1.jpg', rating: 5, ratingCount: 26,
   fromStreet: '720 Bathurst St', fromCity: 'Toronto, ON M5S 2R4',
   toStreet: '504 Euclid Ave', toCity: 'Toronto, ON M6G 2T2',
   delivTime: 'Please water my plants', delivDate: 'May 16, 2015', delivDateNoun: 'Today',
   reqDl: '24 minutes', delivImg: 'http://i.imgur.com/MsJjONB.jpg', deliv: 'Barack Obama'},
  {id: 'Bring Burrito', price: 7.5, requests: 0.7, pledge: 7.5, weight: 66, favortext: 'Do Favor',
   sender: 'Ivan Pan', senderImg: 'http://i.imgur.com/szrgXb2.jpg', number: 2,
   themeColor: 'green', themeColorHex: '#52A43A', latFrom: 43.663242, lngFrom: -79.410690, latTo: 43.653741, lngTo: -79.392512,
   bgImgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/deliv-2.jpg', rating: 4, ratingCount: 21,
   fromStreet: '720 Bathurst St', fromCity: 'Toronto, ON M5S 2R4',
   toStreet: '317 Dundas St W', toCity: 'Toronto, ON M5T 1G4',
   delivTime: 'Bring a burrito', delivDate: 'May 16, 2015', delivDateNoun: 'Today',
   reqDl: '33 minutes', delivImg: 'http://i.imgur.com/tn3R9m6.jpg', deliv: 'Justin Trudeau'},
  {id: 'Math Questions', price: 12, requests: 1.0, pledge: 12, weight: 20, favortext: 'Do Favor',
   sender: 'Ivan Pan', senderImg: 'http://i.imgur.com/szrgXb2.jpg', number: 3,
   themeColor: 'green', themeColorHex: '#52A43A', latFrom: 43.663242, lngFrom: -79.410690, latTo: 43.659075, lngTo: -79.388055,
   bgImgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/deliv-3.jpg', rating: 5, ratingCount: 15,
   fromStreet: '720 Bathurst St', fromCity: 'Toronto, ON M5S 2R4',
   toStreet: '200 Elizabeth St', toCity: 'Toronto, ON M5G 2C4',
   delivTime: 'Help me with these math questions', delivDate: 'May 16, 2015', delivDateNoun: 'Today',
   reqDl: '15 minutes', delivImg: 'http://i.imgur.com/DzPGmVq.jpg', deliv: 'Kim Jong-un'},
  {id: 'Take out Trash', price: 6.5, requests: 1.1, pledge: 6.5, weight: 250, favortext: 'Do Favor',
   sender: 'Ivan Pan', senderImg: 'http://i.imgur.com/szrgXb2.jpg', number: 4,
   themeColor: 'green', themeColorHex: '#52A43A', latFrom: 43.663242, lngFrom: -79.410690, latTo: 43.671215, lngTo: -79.423260,
   bgImgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/deliv-4.jpg', rating: 5, ratingCount: 66,
   fromStreet: '720 Bathurst St', fromCity: 'Toronto, ON M5S 2R4',
   toStreet: '709 Dupont St', toCity: 'Toronto, ON M6G 1Z5',
   delivTime: 'Help me take out the trash', delivDate: 'May 16, 2015', delivDateNoun: 'Today',
   reqDl: '24 minutes', delivImg: 'http://i.imgur.com/bO9GD48.jpg', deliv: 'Donald Trump'},
  {id: 'Change Light Bulb', price: 5, requests: 1.2, pledge: 5, weight: 149, favortext: 'Do Favor',
   sender: 'Ivan Pan', senderImg: 'http://i.imgur.com/szrgXb2.jpg', number: 5,
   themeColor: 'green', themeColorHex: '#52A43A', latFrom: 43.663242, lngFrom: -79.410690, latTo: 43.677195, lngTo: -79.408875,
   bgImgUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/deliv-5.jpg', rating: 5, ratingCount: 26,
   fromStreet: '720 Bathurst St', fromCity: 'Toronto, ON M5S 2R4',
   toStreet: '527 Davenport Rd', toCity: 'Toronto, ON M5R 3R5',
   delivTime: 'Fix my light bulb', delivDate: 'May 16, 2015', delivDateNoun: 'Today',
   reqDl: '24 minutes', delivImg: 'http://i.imgur.com/mwIRHX8.jpg', deliv: 'Asahd Tuck Khaled'}
];

var app = angular.module("delivcard", []);
app.controller("DelivCtrl", ['$scope', function($scope) {

  $scope.cards = delivcardDefaultData;

}]);
