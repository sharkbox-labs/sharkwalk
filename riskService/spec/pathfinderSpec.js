process.env.MONGO_URL = 'mongodb://localhost/jellywave-test';
const specHelpers = require('./specHelpers');
const pathfinder = require('../riskHelpers/pathfinderHelpers');
const expect = require('chai').expect;
const request = require('supertest');
const turf = require('@turf/turf');
const app = require('../server');
const requestHandlerAxios = require('../requestHandlers').axios;
const MockAdapter = require('axios-mock-adapter');
const path = require('path');
require('dotenv')
  .config({
    path: path.join(__dirname, '../../.env'),
  });

const points = [
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [
        -122.39960432052612,
        37.773699921075135,
      ],
    },
  },
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [
        -122.40595579147337,
        37.778703223837695,
      ],
    },
  },
];

const orgDest = {
  origin: {
    lat: points[0].geometry.coordinates[1],
    lng: points[0].geometry.coordinates[0],
  },
  destination: {
    lat: points[1].geometry.coordinates[1],
    lng: points[1].geometry.coordinates[0],
  },
};

const mockTripservice = function mockTripservice() {
  /* eslint-disable */
  const tripServiceResponse = [
    {
      route: {
        contents: 'google maps stuff',
      },
      path: [
        [
          37.773699921075135,
          -122.39960432052612
        ],
        [
          37.774195105445,
          -122.40021234061393
        ],
        [
          37.7744,
          -122.402
        ],
        [
          37.77769965946662,
          -122.40460550595753
        ],
        [
          37.778703223837695,
          -122.40595579147337
        ]
      ],
    },
    {
      route: {
        content: 'google maps stuff',
      },
      path: [
        [
          37.778703223837695,
          -122.40595579147337
        ],
        [
          37.773699921075135,
          -122.39960432052612
        ],
        [
          37.774195105445,
          -122.40021234061393
        ],
        [
          37.774808775889525,
          -122.40098156761469
        ],
        [
          37.77656838289966,
          -122.39875544943297
        ],
        [
          37.77779901103945,
          -122.40029775941801
        ],
        [
          37.77692040703041,
          -122.4014093782482
        ],
        [
          37.778148963927556,
          -122.4029611568613
        ],
        [
          37.77727270296161,
          -122.40407025657149
        ],
        [
          37.77769965946662,
          -122.40460550595753
        ],
      ],
    }
  ];

  /* eslint-enable */
  const mock = new MockAdapter(requestHandlerAxios);
  mock.onPost(`${process.env.TRIP_SERVICE_URL}/routes`)
    .reply(200, tripServiceResponse);
  return mock;
};

let tripServiceMock;

const generatePolyline = function generatePolyline(origin, waypoints, destination) {
  const coordinates = [];
  coordinates.push(origin.coordinates);
  waypoints.forEach(waypoint => coordinates.push(waypoint.geometry.coordinates));
  coordinates.push(destination.coordinates);
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates,
    },
  };
};

describe('Pathfinding', () => {
  before(done => specHelpers.populateDatabaseWithWestSoma(done));
  after(done => specHelpers.clearRiskNodes(done));
  describe('Pathfinder helpers', () => {
    it('should find a path', () => { // eslint-disable-line arrow-body-style
      // const start = Date.now();
      return pathfinder.findPathway(points[0].geometry, points[1].geometry, 5)
        .then((result) => {
          // console.log(`Found result in ${(Date.now() - start) / 1000} s`);
          expect(result).to.be.an('Array');
          expect(result[0]).to.be.an('Object');
          turf.featureOf(result[1], 'Point', 'Pathfinder did not return valid GeoJSON points');
          expect(result[2].properties.risk).to.be.a('number');
          // console.log(JSON.stringify(
          //   generatePolyline(points[0].geometry, result, points[1].geometry), null, 1));
        });
    }).timeout(8000);
  });
  describe('GET /pathfinder | creating paths', () => {
    before(() => { tripServiceMock = mockTripservice(); });
    after(() => { tripServiceMock.restore(); });
    it('should find paths based on risk', (done) => {
      request(app)
        .get('/pathfinder')
        .query(orgDest)
        .end((error, response) => {
          expect(error).to.not.exist; // eslint-disable-line no-unused-expressions
          expect(response.body.error).to.not.exist; // eslint-disable-line no-unused-expressions
          expect(response.body).to.be.an('Array');
          expect(response.body[0]).to.be.an('Object');
          expect(response.body[1]).to.contain.keys(['route', 'riskWeight', 'path', 'risks']);
          done();
        });
    }).timeout(8000);
  });
});
