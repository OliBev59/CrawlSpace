//Import stuff from openmap api


import Circle from 'ol/geom/Circle';
import * as olColor from 'ol/color';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';


const image = new CircleStyle({
  radius: 5,
  //fill: 'red',
  stroke: new Stroke({color: 'red', width: 1}),
});

const styles = {
  'Point': new Style({
    image: image,
  }),
};

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

const vectorSource = new VectorSource ({ //database as object
  format: new GeoJSON(),
  url: '/data/pubs.json',//source of vectors
});
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction,
});



var map = new Map({ //new map
  target: 'map-container', // throw it in map-container
  layers: [
    new TileLayer({
      source: new OSM(), //chuck  map on a layer
    }),
    vectorLayer, 
  ],
  view: new View({ //View
    center: fromLonLat([	-1.548567, 	53.801277]), //center on leeds
    zoom: 14, //zoom in 
  
  }),
});


 //provides a source of features for vector layers.