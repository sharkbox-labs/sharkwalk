process.env.MONGO_URL = 'mongodb://localhost/jellywave-test';
const sfRequest = require('../assessmentWorker/sanFranciscoDataConnector').request;
const MockAdapter = require('axios-mock-adapter');
const ctReports = require('./crimeReports/chinatownReports');
const worker = require('../assessmentWorker/worker');
const expect = require('chai').expect;
const RiskPoint = require('../db/riskPointModel');


require('../db/connection');

/* eslint-disable no-unused-expressions, arrow-body-style */

let mock;

const mockChinatown = function mockChinatown() {
  mock = new MockAdapter(sfRequest);
  mock.onGet('https://data.sfgov.org/resource/cuks-n6tp.json')
    .reply(200, ctReports);
};

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
const clearRiskPoints = function clearRiskPoints(done) {
  RiskPoint.remove({}).then(() => done());
};

describe('Risk worker', () => {
  describe('Running a batch on a risk area', () => {
    before(done => clearRiskPoints(done));
    before(() => {
      mockChinatown();
    });
    after(() => {
      mock.restore();
    });
    it('should save points', () => {
      return worker(chinatown)
        .then((records) => {
          expect(records).to.be.an('Array');
          expect(records[0]).to.be.an('Object');
          expect(records[0].risk).to.be.a('number');
          expect(records[0].location).to.be.an('Object');
          expect(records[0].batchId).to.be.a('string');
        });
    }).timeout(12000);
  });
});
