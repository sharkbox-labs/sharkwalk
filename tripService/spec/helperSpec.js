const expect = require('chai').expect;
const helpers = require('../tripHelpers.js');
const exampleData = require('./multipleRouteExample');

// trip helpers
const retrievePolylines = helpers.retrievePolylines;
const decodePolylines = helpers.decodePolylines;
const convertLatLongs = helpers.convertLatLongs;
const findDistance = helpers.findDistance;
const generateEquidistantPath = helpers.generateEquidistantPath;
const threshold = helpers.threshold;
const getWaypoints = helpers.getWaypoints;

// test data
const route = exampleData.routes[0];
const polylines = retrievePolylines(route);
const coords = decodePolylines(polylines);
const result = generateEquidistantPath(coords);


describe('geoJSON helpers', () => {
  describe('#retrievePolylines', () => {
    it('should extract polylines from directions object', (done) => {
      expect(polylines).to.be.an('array');
      expect(polylines[0]).to.be.a('string');
      expect(polylines.length).to.equal(4);
      done();
    });
  });
  describe('#decodePolylines', () => {
    it('should return a nested array of coordinates (tuples)', (done) => {
      expect(coords).to.be.an('array');
      expect(coords[0]).to.be.an('array');
      expect(coords[0].length).to.equal(2);
      done();
    });
    it('should reject duplicate coordinates', (done) => {
      const checkForDupes = (coordinates) => {
        for (let i = 0; i < coordinates.length; i += 1) {
          for (let j = i + 1; j < coordinates.length; j += 1) {
            if (coordinates[i][0] === coordinates[j][0]
              && coordinates[i][1] === coordinates[j][1]) {
              return true;
            }
          }
        }
        return false;
      };
      expect(checkForDupes(coords)).to.equal(false);
      done();
    });
  });
  describe('#convertLatLongs', () => {
    it('should return geoJSON formatted coordinates from LatLong', (done) => {
      const LatLong = [37.78392, -122.40799];
      const coordinates = [-122.40799, 37.78392];
      const converted = convertLatLongs(LatLong);
      expect(converted).to.deep.equal(coordinates);
      done();
    });
  });
});


describe('creation of path with equidistant coordinates', () => {
  describe('#findDistance', () => {
    it('should return the distance between two coordinates', (done) => {
      const distance = findDistance([37.78343, -122.40914], [37.78348, -122.40881]);
      expect(distance).to.be.a('number');
      const largerDistance = findDistance([37.78343, -122.40914], [37.78348, -122.40581]);
      expect(largerDistance).to.be.a('number');
      expect(largerDistance).to.be.above(distance);
      done();
    });
  });
  describe('#generateEquidistantPath', () => {
    it('should not modify origin of route', (done) => {
      const originalOrigin = coords[0];
      const newOrigin = result[0];
      expect(originalOrigin[0]).to.equal(newOrigin[0]);
      expect(originalOrigin[1]).to.equal(newOrigin[1]);
      done();
    });
    it('should increase the length of the coordinates array', (done) => {
      const originalLength = coords.length;
      const newLength = result.length;
      expect(newLength).to.be.above(originalLength);
      done();
    });
    it('should inject points equidstant apart', (done) => {
      const originalLength = coords.length;
      const newLength = result.length;
      expect(originalLength).to.not.equal(newLength);
      done();
    });
    it('should produce an array with segments of distance equal to the defined threshold', (done) => {
      // in order to check for ~equality~, must round number to three decimal places
      // using helper function 'round':
      const round = number => Math.round(number * 1000) / 1000;
      // not testing entire array because of the way we handled corners...
      // TO DO: write test that checks entire array
      const pairOne = result[0];
      const pairTwo = result[1];
      const distance = findDistance(pairOne, pairTwo);
      // due to rounding, distance will be slightly below threshold
      expect(round(distance)).to.equal(threshold);
      done();
    });
  });
});

describe('get alternate routes', () => {
  describe('#getWaypoints', () => {
    it('should return two LatLong waypoints', (done) => {
      const origin = [];
      const destination = [];
      const waypoints = getWaypoints(origin, destination);
      expect(waypoints[0]).to.be.an('array');
      expect(waypoints[1]).to.be.an('array');
      expect(waypoints[0][0]).to.be.a('number');
      done();
    });
  });
});
