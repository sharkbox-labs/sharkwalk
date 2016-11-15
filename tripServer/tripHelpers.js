const polyline = require('polyline');
const turf = require('turf');

// note: it is purposeful that we are not using the directionsObj's  overview_polyline
// as this is only an approximation of the resulting directions (per the docs)

// extracts polylines from directions object

const retrievePolylines = (directionsObj) => {
  const polylines = [];
  const steps = directionsObj.routes[0].legs[0].steps;
  steps.forEach((step) => {
    if (step.polyline) {
      polylines.push(step.polyline.points);
    }
  });
  return polylines;
};

// converts polylines into LatLngs

const decodePolylines = (polylines) => {
  const coords = [];
  polylines.forEach((line) => {
    const points = polyline.decode(line);
    coords.push(points);
  });
  return coords;
};


// checks distance between coords
// returns true if distance is less than threshold
// returns false if distance is omre than threshold

const threshold = 0.1;

const checkDistance = (pairOne, pairTwo) => {
  const line = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        pairOne,
        pairTwo,
      ],
    },
  };
  const length = turf.lineDistance(line); // default 2nd arg is kilometers
  if (length > threshold) {
    return false;
  }
  return true;
};

// sets threshold to be 100m (0.1 kilometers)

const findPointsAlongWay = () => {
  // for each set of coordinations, check distance with turf.js
  // if greater than threshold
  // find point along the way with turf.along
  // inject this point into array
  // return array of coordinates
};


module.exports = {
  retrievePolylines,
  decodePolylines,
  checkDistance,
  findPointsAlongWay,
};
