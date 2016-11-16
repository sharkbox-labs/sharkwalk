const expect = require('chai').expect;
// const requestHandlers = require('../requestHandlers.js');
const helpers = require('../tripHelpers.js');
// const supertest = require('supertest');
const retrievePolylines = helpers.retrievePolylines;
const decodePolylines = helpers.decodePolylines;
const checkDistance = helpers.checkDistance;
const findPointsAlongWay = helpers.findPointsAlongWay;
// const supertest = require('supertest');
// const app = require('../server');
// const axios = require('axios');

/* eslint-disable quotes, quote-props, comma-dangle */

const exampleDirectionsObject = {
  "geocoded_waypoints": [
    {
      "geocoder_status": "OK",
      "place_id": "ChIJ2a46moWAhYARveaZwQO8qSU",
      "types": [
        "street_address"
      ]
    },
    {
      "geocoder_status": "OK",
      "place_id": "ChIJVVkPs4aAhYAR2h2zUuTQT-4",
      "types": [
        "street_address"
      ]
    }
  ],
  "routes": [
    {
      "bounds": {
        "northeast": {
          "lat": 37.7840081,
          "lng": -122.406077
        },
        "southwest": {
          "lat": 37.7811631,
          "lng": -122.409185
        }
      },
      "copyrights": "Map data ©2016 Google",
      "legs": [
        {
          "distance": {
            "text": "0.4 mi",
            "value": 587
          },
          "duration": {
            "text": "7 mins",
            "value": 438
          },
          "end_address": "82 Mary St, San Francisco, CA 94103, USA",
          "end_location": {
            "lat": 37.7811631,
            "lng": -122.406077
          },
          "start_address": "25 Mason St, San Francisco, CA 94102, USA",
          "start_location": {
            "lat": 37.7836415,
            "lng": -122.409185
          },
          "steps": [
            {
              "distance": {
                "text": "79 ft",
                "value": 24
              },
              "duration": {
                "text": "1 min",
                "value": 17
              },
              "end_location": {
                "lat": 37.783429,
                "lng": -122.4091441
              },
              "html_instructions": "Head <b>south</b> on <b>Mason St</b> toward <b>Turk St</b>",
              "polyline": {
                "points": "wrreFj`cjVh@G"
              },
              "start_location": {
                "lat": 37.7836415,
                "lng": -122.409185
              },
              "travel_mode": "WALKING"
            },
            {
              "distance": {
                "text": "384 ft",
                "value": 117
              },
              "duration": {
                "text": "1 min",
                "value": 86
              },
              "end_location": {
                "lat": 37.7840081,
                "lng": -122.408092
              },
              "html_instructions": "Turn <b>left</b> onto <b>Market St</b>",
              "maneuver": "turn-left",
              "polyline": {
                "points": "mqreFb`cjVIaACO[c@SYu@aA"
              },
              "start_location": {
                "lat": 37.783429,
                "lng": -122.4091441
              },
              "travel_mode": "WALKING"
            },
            {
              "distance": {
                "text": "0.1 mi",
                "value": 200
              },
              "duration": {
                "text": "2 mins",
                "value": 147
              },
              "end_location": {
                "lat": 37.7827319,
                "lng": -122.4064925
              },
              "html_instructions": "Turn <b>right</b> onto <b>5th St</b>",
              "maneuver": "turn-right",
              "polyline": {
                "points": "aureFpybjVPSjAaB^g@NSX_@h@s@l@y@"
              },
              "start_location": {
                "lat": 37.7840081,
                "lng": -122.408092
              },
              "travel_mode": "WALKING"
            },
            {
              "distance": {
                "text": "315 ft",
                "value": 96
              },
              "duration": {
                "text": "1 min",
                "value": 77
              },
              "end_location": {
                "lat": 37.7821284,
                "lng": -122.407276
              },
              "html_instructions": "Turn <b>right</b> onto <b>Mission St</b>",
              "maneuver": "turn-right",
              "polyline": {
                "points": "amreFpobjVV`@pAfBLR"
              },
              "start_location": {
                "lat": 37.7827319,
                "lng": -122.4064925
              },
              "travel_mode": "WALKING"
            },
            {
              "distance": {
                "text": "492 ft",
                "value": 150
              },
              "duration": {
                "text": "2 mins",
                "value": 111
              },
              "end_location": {
                "lat": 37.7811631,
                "lng": -122.406077
              },
              "html_instructions": "Turn <b>left</b> onto <b>Mary St</b><div style=\"font-size:0.9em\">Destination will be on the left</div>",
              "maneuver": "turn-left",
              "polyline": {
                "points": "iireFntbjVvAmBhA{A^e@"
              },
              "start_location": {
                "lat": 37.7821284,
                "lng": -122.407276
              },
              "travel_mode": "WALKING"
            }
          ],
          "traffic_speed_entry": [],
          "via_waypoint": []
        }
      ],
      "overview_polyline": {
        "points": "wrreFj`cjVh@GIaACO[c@iA{A|AuBrBoCl@y@V`@~AzB`EoF"
      },
      "summary": "5th St and Mary St",
      "warnings": [
        "Walking directions are in beta.    Use caution – This route may be missing sidewalks or pedestrian paths."
      ],
      "waypoint_order": []
    }
  ],
  "status": "OK"
};

/* eslint-enable quotes, quote-props, comma-dangle */

const polylines = retrievePolylines(exampleDirectionsObject);
const coords = decodePolylines(polylines);

describe('geoJSON helpers', () => {
  describe('#retrievePolylines', () => {
    it('should extract polylines from directions object', (done) => {
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
      done();
    });
  });
  describe('#checkDistance', () => {
    it('should return a boolean', (done) => {
      const result = checkDistance([37.78343, -122.40914], [37.78348, -122.40881]);
      expect(typeof result).to.equal('boolean');
      done();
    });
  });
  describe('#findPointsAlongWay', () => {
    it('should inject points along the way', (done) => {
      const result = findPointsAlongWay(coords);
      expect(result.length).to.be.above(coords.length);
      done();
    });
  });
});
