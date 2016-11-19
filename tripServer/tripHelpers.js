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

// converts array of polylines into LatLngs

const decodePolylines = (polylines) => {
  const coords = [];
  polylines.forEach((line) => {
    const points = polyline.decode(line);
    points.forEach((point) => {
      if (coords.length === 0) {
        coords.push(point);
      } else if (point[0] !== coords[coords.length - 1][0]
        && point[1] !== coords[coords.length - 1][1]) {
        coords.push(point);
      }
    });
  });
  return coords;
};


// convert google LatLongs into geoJSON coordinates ([Long, Lat])

const convertLatLongs = LatLong => [LatLong[1], LatLong[0]];

// find distance between two coordinates

const findDistance = (pairOne, pairTwo) => {
  const line = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        convertLatLongs(pairOne),
        convertLatLongs(pairTwo),
      ],
    },
  };
  const length = turf.lineDistance(line); // default 2nd arg is kilometers
  return length;
};

// CHANGE SEGMENT LENGTH HERE //

const threshold = 0.025; // (25 m threshold)

// generate line between two coordinates
// find and return point along line at prescribed distance

const insertCoordinate = (pairOne, pairTwo, distance) => {
  const line = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        convertLatLongs(pairOne),
        convertLatLongs(pairTwo),
      ],
    },
  };
  const along = turf.along(line, distance, 'kilometers');
  return convertLatLongs(along.geometry.coordinates);
};

// round number to three decimal places

const round = number => Math.round(number * 1000) / 1000;

// generate coordinate path with equidistant segments between points

const generateEquidistantPath = (coordinates) => {
  // create results array with origin coordinates
  const result = [coordinates[0]];
  // define inner recursive function
  const recurse = (origin, target, indexOfNextTarget) => {
    // base case?
    const segmentLength = findDistance(origin, target);
    // check if equal
    if (round(segmentLength) === threshold) { // round segment length to three decimal places
      // push target coordinates in result array
      result.push(target);
      // recurse with target now as the origin
      return recurse(target, coordinates[indexOfNextTarget], indexOfNextTarget + 1);
    }
    // if distance is greater than threshold, we need to inject points
    if (segmentLength > threshold) {
      // generate next point
      const newPoint = insertCoordinate(origin, target, threshold);
      result.push(newPoint);
      // recurse, reassigning origin to injected point
      return recurse(result[result.length - 1], target, indexOfNextTarget);
    }
    // // if distance is less than threshold
    if (segmentLength < threshold) {
      // if nextTarget does not exist
      if (!coordinates[indexOfNextTarget]) {
        return result;
      }
      const difference = threshold - segmentLength;  // how much more to move towards next target
      // start from target, and move difference towards next Target
      const newPoint = insertCoordinate(target, coordinates[indexOfNextTarget], difference);
      // insert new point into result
      result.push(newPoint);
      // recurse using that new point
      return recurse(result[result.length - 1], coordinates[indexOfNextTarget],
        indexOfNextTarget + 1);
    }
  };
  return recurse(result[0], coordinates[1], 2); // origin, target, nextTargets
};

// getPath input is directions object returned from google maps API
// output is array of coordinates along walker's path

const getPath = (directionsObj) => {
  const polylines = retrievePolylines(directionsObj);
  const coordinates = decodePolylines(polylines);
  const path = generateEquidistantPath(coordinates);
  return path;
};


module.exports = {
  retrievePolylines,
  decodePolylines,
  convertLatLongs,
  getPath,
  findDistance,
  generateEquidistantPath,
  threshold,
};
