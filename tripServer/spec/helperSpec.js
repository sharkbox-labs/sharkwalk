const expect = require('chai').expect;
const turf = require('turf');
const helpers = require('../tripHelpers.js');

const retrievePolylines = helpers.retrievePolylines;
const decodePolylines = helpers.decodePolylines;
const checkDistance = helpers.checkDistance;
const findPointsAlongWay = helpers.findPointsAlongWay;
const convertLatLongs = helpers.convertLatLongs;
const exampleDirectionsObject = require('./specData.js');

const polylines = retrievePolylines(exampleDirectionsObject);
const coords = decodePolylines(polylines);

describe('geoJSON helpers', () => {
  describe('#retrievePolylines', () => {
    it('should extract polylines from directions object', (done) => {
      expect(polylines).to.be.an('array');
      expect(polylines[0]).to.be.a('string');
      expect(polylines.length).to.equal(5);
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
      expect(coords.length).to.equal(20); // length would be 24 with duplicates
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
  describe('#checkDistance', () => {
    it('should return true if distance is less than threshold', (done) => {
      const result = checkDistance([37.78343, -122.40914], [37.78348, -122.40881]);
      expect(result).to.be.a('boolean');
      expect(result).to.equal(true);
      done();
    });
    it('should return false if distance is greater than threshold', (done) => {
      const result = checkDistance([37.78343, -122.40914], [37.78348, -122.50881]);
      expect(result).to.equal(false);
      done();
    });
  });
  describe('#findPointsAlongWay', () => {
    it('should inject points along the way', (done) => {
      const result = findPointsAlongWay(coords);
      expect(result.length).to.be.above(coords.length);
      // const pair = [[-122.40799, 37.78392], [-122.40758402669043, 37.78360516397757]];
      const pair = [result[0], result[1]];
      const line = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: pair,
        },
      };
      const distance = turf.lineDistance(line);
      expect(distance).to.be.below(0.05);
      done();
    });
    it('should produce an array with segments of distance less than defined threshold', (done) => {
      const result = findPointsAlongWay(coords);
      let distanceLargerThanThreshold = false;
      for (let i = 1; i < result.length; i += 1) {
        const current = result[i];
        const prev = result[i - 1];
        if (!checkDistance(prev, current)) {
          distanceLargerThanThreshold = true;
        }
      }
      expect(distanceLargerThanThreshold).to.equal(false);
      done();
    });
  });
});
