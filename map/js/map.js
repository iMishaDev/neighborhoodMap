
// This global map variable is to ensure only ONE map is created.//
var map;

// This global markers array  is to ensure that it can be accessed from everywhere//
var markers = [];

// This global polygon variable is to ensure only ONE polygon is rendered//
var polygon = null;

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

var largeInfowindow;

function initMap() {


var locations = [
{title:'CN Tower', location:{ lat:43.6425701,lng:-79.3892455 }},
{title:'Royal Ontario Museum', location:{ lat:43.6677136,lng:-79.3969658} },
{title:'Rogers Centre', location:{lat:43.6414417,lng:-79.3915419}},
{title:'Art Gallery of Ontario', location:{lat:43.6536105,lng:-79.394701}},
{title:'Casa Loma', location:{lat:43.678041,lng:-79.4116326}},
{title:'University Of Toronto', location:{lat:43.6647541,lng:-79.4034208}},
];


  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat:43.6570321, lng:-79.6010378 },
    styles: styles,
    mapTypeControl: false,
    zoom: 13
  });

// infowindow to present every marker info on it//
 largeInfowindow = new google.maps.InfoWindow();

 // create colorful markers//
 var defaultIcon = makeMarkerIcon('7F00FF');
 var highlightedIcon = makeMarkerIcon('E5CCFF');

// loop through all locations to creat thei rown markers//
 for ( var i = 0; i< locations.length; i++){
  var position = locations[i].location;
  var title = locations[i].title;

  var marker = new google.maps.Marker({
    position: position,
    title: title,
    draggable: true,
    icon:defaultIcon,
    animation:google.maps.Animation.DROP,
    id:i,
    infowindow: largeInfowindow
  });

  markers.push(marker);
  // when marker is clicked? it will creat infowindow holding that marker info//
  marker.addListener('click', function() {
    toggleBounce(this);
    populateInfoWindow(this, largeInfowindow);
  });



// animation //
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });

// animation //
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
}
// create bounds to make sure the map will show all markers //
var bounds = new google.maps.LatLngBounds();

for(var i = 0; i< markers.length; i++ ){
  markers[i].setMap(map);
  bounds.extend(markers[i].position);
}
map.fitBounds(bounds);
}

function toggleBounce(marker) {
  if(marker)
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 3000);
        }
      }

// when user click an element from locations list, this function will point to that location marker and populate its infowindow //
function pointToMarker(location){

  var marker = findLocationMarker(location);
  closeInfo(marker);
  toggleBounce(marker);
  populateInfoWindow(marker, largeInfowindow);
}


function findLocationMarker (location) {
  for(var i =0; i < markers.length; i++){
    if(markers[i].title === location.title())
    return markers[i];
  }
}
// makes two api calls, wikipedia call to fetch an article + google streetview api to fetch a panoram image about that place  //
function populateInfoWindow(marker, infowindow) {

  if(marker)
  if(infowindow.marker != marker) {
    infowindow.marker = marker;

    infowindow.setContent('<div>'+ marker.title +'</div>');

    infowindow.addListener('closeclick',function() {
      infowindow.close();
    });

    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;


       var wikiUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=opensearch&search='+ marker.title+'&prop=revisions&rvprop=content&callback=?';
       $.ajax({
         url: wikiUrl,
         dataType: "jsonp",
         success: function(data) {
           // request successed //
           var articleList = data[1];

             articleStr = articleList[0];
             var url = 'https://en.wikipedia.org/wiki/' + articleStr;

             function getStreetView(data, status) {

                  if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                      nearStreetViewLocation, marker.position);

                      infowindow.setContent('<div>' + marker.title + '</div> wikipedia: <a href="'+url+'">'+articleStr +'</a> <div id="pano"></div>');
                      var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                          heading: heading,
                          pitch: 30
                        }
                      };
                    var panorama = new google.maps.StreetViewPanorama(
                      document.getElementById('pano'), panoramaOptions);
                  } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                      '<div>No Street View Found</div>');
                  }
                }

             streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

         },
            error: function(jqXHR, textStatus, errorThrown) {
               alert('An error occurred... check your internet connection!');
            }
       });

       infowindow.open(map, marker);
  }
}

// when user start filtering, this function is required to make all markers invisible then show only the filterd ones //
function hideListings () {
  markers.forEach(function(marker) {
    closeInfo(marker)
    marker.setVisible(false);
 });
}

function closeInfo(marker) {
  if(marker)
  marker.infowindow.close(map, marker);
}


// show certain marker after fitering //
function showMarker (i) {
  if(markers[i])
    markers[i].setVisible(true);
}


// create the icon  //
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

function mapError() {
  alert("error : please check your internet connection and everything is set properly ");
};

// show the side nav which is by defult hiddin //
function openNav() {
    document.getElementById("mySidenav").style.left = "0";
}

// hide the side nav  //
function closeNav() {
    document.getElementById("mySidenav").style.left = "-500px";
}
