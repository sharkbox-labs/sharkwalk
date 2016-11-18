process.env.MONGO_URL = 'mongodb://localhost/jellywave-test';
const turf = require('@turf/turf');
const expect = require('chai').expect;
const specHelpers = require('./specHelpers');

const riskPointController = require('../db/riskPointController');

require('../db/connection');

/* eslint-disable no-unused-expressions, arrow-body-style */

const randomLocation = specHelpers.generateRandomLocation();

const points = [
  {
    risk: 10,
    location: randomLocation,
  },
  {
    risk: 20,
    location: specHelpers.generateRandomLocation(),
  },
  {
    risk: 30,
    location: specHelpers.generateRandomLocation(),
  },
];

describe('Risk points', () => {
  describe('Creating risk points', () => {
    beforeEach(done => specHelpers.clearRiskPoints(done));
    it('should throw an error with a malformed point', () => {
      return riskPointController.createRiskPoint(45, [-150, 45], 'test')
        .catch((error) => {
          expect(error).to.exist;
        });
    });

    it('should create a risk point', () => {
      return riskPointController.createRiskPoint(66, specHelpers.generateRandomLocation(), 'test')
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
    before(done => specHelpers.clearRiskPoints(done));
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

    it('should retrieve risk points by location from a GeoJSON point', () => {
      // generate a point near the 'random location'
      const offsetPoint = turf.destination(randomLocation, 0.004, 45, 'kilometers');
      return riskPointController.findRiskPointsNear(offsetPoint.geometry, 100)
        .then((nearPoints) => {
          expect(nearPoints).to.be.an('Array');
          turf.geojsonType(nearPoints[0].location, 'Point', 'Retrieve points by location test');
        });
    });
  });
});
