// map style, taken from here: https://snazzymaps.com/style/139602/green-grey  //
  var styles = [
  {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "saturation": 36
          },
          {
              "color": "#000000"
          },
          {
              "lightness": 40
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#000000"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 17
          },
          {
              "weight": 1.2
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 21
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#a5cd38"
          },
          {
              "lightness": 17
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 29
          },
          {
              "weight": 0.2
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 18
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 19
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 17
          }
      ]
  }
];


var locs = [
{title:'CN Tower', location:{ lat:43.6425701,lng:-79.3892455 }},
{title:'Royal Ontario Museum', location:{ lat:43.6677136,lng:-79.3969658} },
{title:'Rogers Centre', location:{lat:43.6414417,lng:-79.3915419}},
{title:'Art Gallery of Ontario', location:{lat:43.6536105,lng:-79.394701}},
{title:'Casa Loma', location:{lat:43.678041,lng:-79.4116326}},
{title:'University Of Toronto', location:{lat:43.6647541,lng:-79.4034208}},
];



// create an object that represent every data model //
var Location = function(location) {
  this.title = ko.observable(location.title);
  this.lat   = ko.observable(location.location.lat);
  this.lng   = ko.observable(location.location.lng);
};



var ViewModel = function () {

  var self = this;
  this.query = ko.observable('');
  this.locations = ko.observableArray([]);
  locs.forEach(function(location) {
  self.locations.push(new Location(location));
  });
// start fitering  //
    this.search = function(value) {
    hideListings();
    self.locations.removeAll();
    for(var x in locs) {
      if(locs[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.locations.push(new Location(locs[x]));
        showMarker(x);
      }
    }
  };
   self.query.subscribe(self.search);


   this.show = function(clickedLocation) {
       pointToMarker(clickedLocation);
 };
};




ko.applyBindings(new ViewModel());
