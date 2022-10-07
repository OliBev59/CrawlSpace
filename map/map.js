//Import stuff from openmap api


import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {Map, View, Feature} from 'ol';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Geolocation from 'ol/Geolocation';
import Point from 'ol/geom/Point';
import {Fill, Stroke, Style, Circle as CircleStyle} from 'ol/style';



const pubSource = new VectorSource ({ //database as object
  format: new GeoJSON(),
  url: '/data/pubs.json',//source of vectors
});
const vectorLayer = new VectorLayer({ //layer for points
  source: pubSource, //source is pubSource
  style: {  //style for points (red circle)
    'circle-radius': 5,
    'circle-fill-color': 'red'
  },
});

const view = new View({
  center: fromLonLat([	-1.548567, 	53.801277]), //center on leeds
  zoom: 14, //zoom in 
})

var map = new Map({ //new map
  target: 'map-container', // throw it in map-container
  layers: [
    new TileLayer({
      source: new OSM(), //chuck  map on a layer
    }),
    vectorLayer, 
  ],
  view: view
});


 const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true to have the heading value.
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(), //project onto the view
});

function el(id) { 
  return document.getElementById(id);
}

el('track').addEventListener('change', function () { //see if tickbox has been checkd
  geolocation.setTracking(this.checked);
});

// update the HTML page when the position changes.
geolocation.on('change', function () {
  el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
  el('altitude').innerText = geolocation.getAltitude() + ' [m]';
  el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
  el('heading').innerText = geolocation.getHeading() + ' [rad]';
  el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
});

// handle geolocation error.
geolocation.on('error', function (error) {
  const info = document.getElementById('info');
  info.innerHTML = error.message;
  info.style.display = '';
});

const accuracyFeature = new Feature();
geolocation.on('change:accuracyGeometry', function () {
  accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

const positionFeature = new Feature(); //style for location marker
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  })
);

geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
});

new VectorLayer({
  map: map,
  source: new VectorSource({
    features: [accuracyFeature, positionFeature],
  }),
});
