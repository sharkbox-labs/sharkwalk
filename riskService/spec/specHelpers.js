process.env.MONGO_URL = 'mongodb://localhost/jellywave-test';

const RiskPoint = require('../db/riskPointModel');
const RiskNode = require('../db/riskNodeModel');
const turf = require('@turf/turf');
const sfRequest = require('../assessmentWorker/sanFranciscoDataConnector').request;
const MockAdapter = require('axios-mock-adapter');
const ctReports = require('./crimeReports/chinatownReports');
const westSomaReports = require('./crimeReports/westSomaReports');
const worker = require('../assessmentWorker/worker');
const graphWorker = require('../graphWorker/graphWorker');
const westSomaNodes = require('./geoData/westSomaNodes');
const westSomaSegments = require('./geoData/westSomaSegments');

const getRandom = (min, max) => (Math.random() * (max - min)) + min;

const generateRandomLocation = () =>
  turf.point([getRandom(-122.49, -122.38), getRandom(37.716, 37.788)]).geometry;

const clearRiskPoints = function clearRiskPoints(done) {
  RiskPoint.remove({}).then(() => done());
};

const clearRiskNodes = function clearRiskNodes(done) {
  RiskNode.remove({}).then(() => done());
};

const mockChinatown = function mockChinatown() {
  const mock = new MockAdapter(sfRequest);
  mock.onGet('https://data.sfgov.org/resource/cuks-n6tp.json')
    .reply(200, ctReports);
  return mock;
};

const mockWestSoma = function mockWestSoma() {
  const mock = new MockAdapter(sfRequest);
  mock.onGet('https://data.sfgov.org/resource/cuks-n6tp.json')
    .reply(200, westSomaReports);
  mock.onGet('https://data.sfgov.org/resource/stqf-m6iw.json')
    .reply(200, westSomaNodes);
  mock.onGet('https://data.sfgov.org/resource/7hfy-8sz8')
    .reply(200, westSomaSegments);
  return mock;
};

const populateDatabaseWithWestSoma = function populateDatabaseWithWestSoma(done) {
  const westSoma = {
    type: 'FeatureCollection',
    features: [
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
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [
                -122.39782333374022,
                37.77230911236875,
              ],
              [
                -122.39336013793945,
                37.77587088725018,
              ],
              [
                -122.40438938140868,
                37.78329917982422,
              ],
              [
                -122.41267204284668,
                37.77746514993689,
              ],
              [
                -122.40202903747559,
                37.77047727561618,
              ],
              [
                -122.39782333374022,
                37.77230911236875,
              ],
            ],
          ],
        },
      },
    ],
  };
  const mock = mockWestSoma();
  graphWorker(westSoma, true)
    .then(() => {
      mock.restore();
      done();
    })
    .catch((error) => {
      mock.restore();
      console.log(error); // eslint-disable-line no-console
      done();
    });
};

const populateDatabaseWithChinatown = function populateDatabaseWithChinatown(done) {
  const chinatown = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [
                -122.4079942703247,
                37.79294806153635,
              ],
              [
                -122.40281224250792,
                37.79362631865263,
              ],
              [
                -122.4032735824585,
                37.79583908920013,
              ],
              [
                -122.40437865257263,
                37.79648340839478,
              ],
              [
                -122.40848779678345,
                37.79591539045074,
              ],
              [
                -122.4079942703247,
                37.79294806153635,
              ],
            ],
          ],
        },
      },
    ],
  };
  const mock = mockChinatown();
  worker(chinatown, true)
    .then(() => {
      mock.restore();
      done();
    })
    .catch((error) => {
      mock.restore();
      console.log(error); // eslint-disable-line no-console
      done();
    });
};


const coordsNear = function coordsNear(point, number) {
  const result = [];
  for (let i = 0; i < number; i += 1) {
    const latJitter = getRandom(-400, 400) / 1000000;
    const longJitter = getRandom(-400, 400) / 1000000;
    result.push([point[0] + latJitter, point[1] + longJitter]);
  }
  return result;
};

const pointsNear = function pointsNear(point, number) {
  const result = [];
  for (let i = 0; i < number; i += 1) {
    const latJitter = getRandom(-400, 400) / 1000000; // move a little off the
    const longJitter = getRandom(-400, 400) / 1000000;// original points
    const newPoint = Object.assign({}, point);
    newPoint.coordinates = [...newPoint.coordinates];
    newPoint.coordinates[0] += longJitter;
    newPoint.coordinates[1] += latJitter;
    result.push(newPoint);
  }
  return result;
};

module.exports = {
  generateRandomLocation,
  clearRiskPoints,
  mockChinatown,
  populateDatabaseWithChinatown,
  coordsNear,
  pointsNear,
  clearRiskNodes,
  mockWestSoma,
  populateDatabaseWithWestSoma,
};
