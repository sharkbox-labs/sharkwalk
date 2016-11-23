const polyline = require('polyline');
const turf = require('turf');

// The following functions convert the directioss object recieved from the googleMaps API into
// an array of coordinates along the path.
// The array of coordinates are separated by a prescribed threshold.

// note: it is purposeful that we are not using the directionsObj's  overview_polyline
// as this is only an approximation of the resulting directions (per the docs)

// extracts polylines from each route

const retrievePolylines = (route) => {
  const polylines = [];
  const steps = route.legs[0].steps;
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
// note: the strategy for handling corners along path may need some refining.

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


const handleCornersDifferently = (coordinates) => {
  const result = [coordinates[0]];
  const recurse = (origin, target, indexOfNextTarget) => {
    const segmentLength = findDistance(origin, target);
    if (round(segmentLength) === threshold) {
      result.push(target);
      return recurse(target, coordinates[indexOfNextTarget], indexOfNextTarget + 1);
    }
    if (segmentLength > threshold) {
      const newPoint = insertCoordinate(origin, target, threshold);
      result.push(newPoint);
      return recurse(result[result.length - 1], target, indexOfNextTarget);
    }
    if (segmentLength < threshold) {
      if (!coordinates[indexOfNextTarget]) {
        return result;
      }
      // const difference = threshold - segmentLength;
      // const newPoint = insertCoordinate(target, coordinates[indexOfNextTarget], difference);
      const newPoint = insertCoordinate(origin, coordinates[indexOfNextTarget], threshold);
      result.push(newPoint);
      return recurse(result[result.length - 1], coordinates[indexOfNextTarget],
        indexOfNextTarget + 1);
    }
  };
  return recurse(result[0], coordinates[1], 2);
};


// getPaths input is route property returned from google maps API
// output is array of coordinates along walker's path

const getPaths = (routes) => {
  const paths = [];
  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const polylines = retrievePolylines(route);
    const coordinates = decodePolylines(polylines);
    const path = generateEquidistantPath(coordinates);
    paths.push(path);
  }
  return paths;
};

// function getWayPoints takes origin and destination LatLngs, and returns two waypoints
// using turf.js geoJSON functions
// NOTE: if user inputs place rather than LatLngs, they must be converted prior

const getWayPoints = (originLatLng, destinationLatLng) => {
  const origin = convertLatLongs(originLatLng);
  const destination = convertLatLongs(destinationLatLng);
  const distance = turf.distance(turf.point(origin), turf.point(destination), 'kilometers');
  const midpoint = turf.midpoint(turf.point(origin), turf.point(destination));
  const bearing = turf.bearing(turf.point(origin), turf.point(destination));
  // define waypoint's distance from midpoint here:
  const distanceFromMidpoint = distance / 3;
  let waypoint1 = turf.destination(midpoint, distanceFromMidpoint, bearing + 90, 'kilometers');
  let waypoint2 = turf.destination(midpoint, distanceFromMidpoint, bearing - 90, 'kilometers');
  waypoint1 = convertLatLongs(waypoint1.geometry.coordinates);
  waypoint2 = convertLatLongs(waypoint2.geometry.coordinates);
  return [waypoint1, waypoint2];
};


module.exports = {
  retrievePolylines,
  decodePolylines,
  convertLatLongs,
  getPaths,
  findDistance,
  generateEquidistantPath,
  threshold,
  handleCornersDifferently,
  getWayPoints,
};
