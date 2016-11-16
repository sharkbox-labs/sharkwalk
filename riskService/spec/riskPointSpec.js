process.env.MONGO_URL = 'mongodb://localhost/jellywave-test';

const expect = require('chai').expect;
const turf = require('@turf/turf');
const RiskPoint = require('../db/riskPointModel');
const riskPointController = require('../db/riskPointController');

require('../db/connection');

/* eslint-disable no-unused-expressions, arrow-body-style */

const getRandom = (min, max) => (Math.random() * (max - min)) + min;

const generateRandomLocation = () =>
  turf.point([getRandom(-122.49, -122.38), getRandom(37.716, 37.788)]).geometry;

const clearRiskPoints = function clearRiskPoints(done) {
  RiskPoint.remove({}).then(() => done());
};

const points = [
  {
    risk: 10,
    location: generateRandomLocation(),
  },
  {
    risk: 20,
    location: generateRandomLocation(),
  },
  {
    risk: 30,
    location: generateRandomLocation(),
  },
];

describe('Risk points', () => {
  describe('Creating risk points', () => {
    beforeEach(done => clearRiskPoints(done));
    it('should throw an error with a malformed point', () => {
      return riskPointController.createRiskPoint(45, [-150, 45], 'test')
        .catch((error) => {
          expect(error).to.exist;
        });
    });

    it('should create a risk point', () => {
      return riskPointController.createRiskPoint(66, generateRandomLocation(), 'test')
        .then((riskPoint) => {
          expect(riskPoint).to.exist;
          expect(riskPoint.risk).to.equal(66);
          turf.geojsonType(riskPoint.location, 'Point', 'Create risk point test');
        })
        .catch((error) => {
          expect(error).to.not.exist;
        });
    });

    it('should create multiple risk points', () => {
      return riskPointController.createRiskPoints(points, 'test')
        .then((riskPoints) => {
          expect(riskPoints).to.exist;
          expect(riskPoints.length).to.equal(3);
          expect(riskPoints[0].risk).to.equal(10);
        })
        .catch((error) => {
          expect(error).to.not.exist;
        });
    });
  });

  describe('Retrieving risk points', () => {
    before(done => clearRiskPoints(done));
    before((done) => {
      riskPointController.createRiskPoints(points, 'batchTest')
        .then(() => done());
    });

    it('should retrieve risk points by batchId', () => {
      return riskPointController.findRiskPointsByBatchId('batchTest')
        .then((riskPoints) => {
          expect(riskPoints).to.exist;
          expect(riskPoints.length).to.equal(3);
        })
        .catch((error) => {
          expect(error).to.not.exist;
        });
    });
  });
});
