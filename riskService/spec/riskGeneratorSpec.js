const expect = require('chai').expect;
const turf = require('@turf/turf');
const sfRequest = require('../assessmentWorker/sanFranciscoDataConnector').request;
const MockAdapter = require('axios-mock-adapter');
const riskGenerator = require('../assessmentWorker/riskGenerator');
const hrReports = require('./crimeReports/hackReactorReports');
const bhReports = require('./crimeReports/bernalHeightsReports');
const ctReports = require('./crimeReports/chinatownReports');

let mock;

const mockChinatown = function mockChinatown() {
  mock = new MockAdapter(sfRequest);
  mock.onGet('https://data.sfgov.org/resource/cuks-n6tp.json')
    .reply(200, ctReports);
};

/* eslint-disable no-unused-expressions, arrow-body-style */

const hackReactor = {
  type: 'Feature',
  properties: {
    name: 'Hack Reactor',
  },
  geometry: {
    type: 'Point',
    coordinates: [
      -122.40872383117676,
      37.78363835344461,
    ],
  },
};

const bernalHightsPark = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [
      -122.41325676441194,
      37.74389357554566,
    ],
  },
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

describe('Generating risk', () => {
  describe('Generating risk for a point', () => {
    let hackReactorRisk;

    it('given crime data, it should generate risk', () => {
      hackReactorRisk = riskGenerator.generateRiskForPoint(hackReactor, hrReports);
      expect(hackReactorRisk).to.be.a('number');
      expect(hackReactorRisk).to.be.above(0);
    });

    it('should rate risk lower in areas with less reports', () => {
      const bernalHeightsRisk = riskGenerator.generateRiskForPoint(bernalHightsPark, bhReports);
      expect(bernalHeightsRisk).to.be.a('number');
      expect(bernalHeightsRisk).to.be.above(0);
      expect(bernalHeightsRisk).to.be.below(hackReactorRisk);
    });
  });

  describe('Generating risk for an area', () => {
    before(() => {
      mockChinatown();
    });
    after(() => {
      mock.restore();
    });
    it('should generate risk for an area', () => {
      return riskGenerator.generateRiskForArea(chinatown)
        .then((riskObj) => {
          turf.collectionOf(riskObj, 'Point', 'Risk Generator Spec');
          expect(riskObj.features[2].properties.risk).to.be.a('number');
        });
    });
  });
});
