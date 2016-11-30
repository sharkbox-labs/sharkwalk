const polyline = require('polyline');
const turf = require('turf');
const path = require('path');
// The following functions convert the directioss object recieved from the googleMaps API into
// an array of coordinates along the path.
// The array of coordinates are separated by a prescribed threshold.

// note: it is purposeful that we are not using the directionsObj's  overview_polyline
// as this is only an approximation of the resulting directions (per the docs)

// extracts polylines from each route

/**
 * @param  {Array} route - from directions object
 * @return {Array} polylines - array of polylines along the route
 */
const retrievePolylines = (route) => {
  const polylines = [];
  let steps = [];
  route.legs.forEach((leg) => { steps = steps.concat(leg.steps); });
  steps.forEach((step) => {
    if (step.polyline) {
      polylines.push(step.polyline.points);
    }
  });
  return polylines;
};

const generateTravelTime = (legs) => {
  let time = 0;
  legs.forEach((leg) => { time += leg.duration.value; });
  return time;
};

const generateTravelDistance = (legs) => {
  let distance = 0;
  legs.forEach((leg) => { distance += leg.distance.value; });
  return distance;
};

// const generateDirectionsURL = (legs) => {
//   const url = 'https://www.google.com/maps/dir';
//   const suffix = 'data=!3m1!4b1!4m2!4m1!3e2';
//   const coords = [];
//   legs.forEach((leg) => {
//     coords.push(`${leg.start_location.lat},${leg.start_location.lng}`);
//   });
//   coords.push(`${legs[legs.length - 1].end_location.lat},${legs[legs.length - 1].end_location.lng}`);
//   return path.join(url, coords.join('/'), suffix);
// };
//
const getWaypoints = (legs) => {
  const coords = [];
  legs.forEach((leg) => {
    coords.push([leg.start_location.lat, leg.start_location.lng]);
  });
  coords.push([legs[legs.length - 1].end_location.lat, legs[legs.length - 1].end_location.lng]);
  return coords;
};

const generateDirectionsURL = (legs) => {
  const waypoints = getWaypoints(legs);
  const url = 'https://www.google.com/maps/dir/';
  const suffix = '!1m0!3e2'; // indicates end of waypoints & mode of travel
  const coords = [];
  coords.push(`${waypoints[0][0]},${waypoints[0][1]}`);
  coords.push(`${waypoints[waypoints.length - 1][0]},${waypoints[waypoints.length - 1][1]}`);
  coords.push('am=t');
  const originDestin = coords.join('/');
  const x = waypoints.length - 2; // number of VIA points
  const data = `/data=!4m${(5 * x) + 4}!4m${(5 * x) + 3}!1m${5 * x}`;
  let waypointString = '';
  for (let i = 1; i < waypoints.length - 1; i += 1) {
    waypointString += `!3m4!1m2!1d${waypoints[i][1]}!2d${waypoints[i][0]}!3s0x0:0x0`;
  }
  return `${url + originDestin + data + waypointString + suffix}`;
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

/**
 * @param  {number[]} pairOne - starting coordinate for segment of path (LatLng tuple)
 * @param  {number[]} pairTwo - ending coordinate for segment of path (LatLng tuple)
 * @param  {Number} distance - distance along path from starting point to travel (threshold)
 * @return {number[]} coordinates - point distance along path from pairOne to pairTow (LatLng tuple)
 */
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

const precisionRound = function precisionRound(number, precision) {
  const factor = Math.pow(10, precision); // eslint-disable-line no-restricted-properties
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
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
    paths.push(path.map(coords => [precisionRound(coords[0], 5), precisionRound(coords[1], 5)]));
  }
  return paths;
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
  generateTravelTime,
  generateTravelDistance,
  generateDirectionsURL,
};
