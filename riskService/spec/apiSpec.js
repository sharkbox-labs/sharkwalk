process.env.MONGO_URL = 'mongodb://localhost/jellywave-test';
const expect = require('chai').expect;
const request = require('supertest');
const specHelpers = require('./specHelpers');
const turf = require('@turf/turf');
const app = require('../server');

/* eslint-disable no-unused-expressions */
const woowooPoint = {
  type: 'Point',
  coordinates: [
    -122.40707159042358,
    37.79358816685511,
  ],
};

const woowooCoords = [37.79358816685511, -122.40707159042358];

const coordsArray = specHelpers.coordsNear(woowooCoords, 5);
const pointsArray = specHelpers.pointsNear(woowooPoint, 5);

describe('Risk Service API', () => {
  before(done => specHelpers.populateDatabaseWithChinatown(done));
  after(done => specHelpers.clearRiskPoints(done));
  describe('POST /path | Finding risk for paths', () => {
    it('should get risk for a path', (done) => {
      request(app)
        .post('/path')
        .send([{ path: coordsArray }, { path: coordsArray }])
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.body.error).to.not.exist;
          expect(response.body).to.be.an('Array');
          expect(response.body[0]).to.have.keys(['risks', 'maxRisk', 'averageRisk', 'totalRisk']);
          expect(response.body[0].risks).to.be.an('Array');
          expect(response.body[1].maxRisk).to.be.a('number');
          expect(response.body[0].averageRisk).to.be.a('number');
          expect(response.body[1].totalRisk).to.be.a('number');
          done();
        });
    });
  });

  describe('POST /risk | Legacy risk finding enpoint', () => {
    it('should get risk for a single coordinate', (done) => {
      request(app)
        .post('/risk')
        .send({ point: woowooCoords })
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.body.error).to.not.exist;
          expect(response.status).to.equal(200);
          expect(response.body.risk).to.be.a('number');
          expect(response.body.risk).to.be.above(0);
          done();
        });
    });

    it('should get risk for an array of coordinates', (done) => {
      request(app)
        .post('/risk')
        .send({ point: coordsArray })
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.body.error).to.not.exist;
          expect(response.status).to.equal(200);
          expect(response.body.risk).to.be.a('Array');
          expect(response.body.risk.length).to.equal(5);
          expect(response.body.risk[0]).to.be.above(0);
          done();
        });
    });

    it('should get risk for a single GeoJSON point', (done) => {
      request(app)
        .post('/risk')
        .send({ point: woowooPoint })
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.body.error).to.not.exist;
          expect(response.status).to.equal(200);
          expect(response.body.risk).to.be.an('object');
          turf.geojsonType(response.body.risk, 'Point', 'Risk for single point');
          expect(response.body.risk.properties.risk).to.be.above(0);
          done();
        });
    });

    it('should get risk for an array of GeoJSON points', (done) => {
      request(app)
        .post('/risk')
        .send({ point: pointsArray })
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.body.error).to.not.exist;
          expect(response.status).to.equal(200);
          expect(response.body.risk).to.be.an('Array');
          turf.geojsonType(response.body.risk[0], 'Point', 'Risk for points array');
          expect(response.body.risk[0].properties.risk).to.be.above(0);
          done();
        });
    });
  });
});
