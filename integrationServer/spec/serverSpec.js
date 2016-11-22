const request = require('supertest');
const nock = require('nock');
const expect = require('chai').expect;
const specData = require('./specData');
const app = require('../server');

const testQuery = {
  origin: {
    lat: 37.7842729,
    lng: -122.4055131,
  },
  destination: {
    lat: 37.7812491,
    lng: -122.4090739,
  },
};


beforeEach(() => {
  // Set up mock servers for tripService and riskService
  const testTripService = nock('http://localhost:3001') // eslint-disable-line
    .get('/trip')
    .query(testQuery)
    .reply(200, specData.exampleTripServiceResponse);

  const testRiskService = nock('http://localhost:3002') // eslint-disable-line
    .post('/risk')
    .reply(200, specData.exampleRiskServiceResponse);
});


describe('Integration Server:', () => {
  describe('GET', () => {
    describe('/api', () => {
      it('should respond with a 404 status code on /api GET', (done) => {
        request(app)
          .get('/api')
          .expect(404, done);
      });
      describe('/trip', () => {
        it('should have \'route\' and \'path\' in the response body', (done) => {
          request(app)
            .get('/api/trip')
            .query(testQuery)
            .end((error, response) => {
              expect(error).to.not.exist;
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property('route');
              expect(response.body).to.have.property('path');
              done();
            });
        });

        it('should respond with \'route\' as an object', (done) => {
          request(app)
            .get('/api/trip')
            .query(testQuery)
            .end((error, response) => {
              expect(error).to.not.exist;
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property('route').to.be.an('object');
              done();
            });
        });

        it('should preserve the \'route\' object as it was received from the Google Maps API', (done) => {
          request(app)
            .get('/api/trip')
            .query(testQuery)
            .end((error, response) => {
              expect(error).to.not.exist;
              expect(response.status).to.equal(200);
              expect(response.body.route).to.have.property('geocoded_waypoints').to.be.an('array');
              expect(response.body.route).to.have.property('routes').to.be.an('array');
              expect(response.body.route).to.have.property('status').to.equal('OK');
              done();
            });
        });

        it('should provide walking directions', (done) => {
          request(app)
            .get('/api/trip')
            .query(testQuery)
            .end((error, response) => {
              const travelMode = response.body.route.routes[0].legs[0].steps[0].travel_mode;
              expect(error).to.not.exist;
              expect(response.status).to.equal(200);
              expect(travelMode).to.equal('WALKING');
              done();
            });
        });

        it('should provide directions for the origin and destination that was submitted', (done) => {
          request(app)
            .get('/api/trip')
            .query(testQuery)
            .end((error, response) => {
              const directionsStart = response.body.route.routes[0].legs[0].start_location;
              const directionsEnd = response.body.route.routes[0].legs[0].end_location;
              expect(error).to.not.exist;
              expect(response.status).to.equal(200);
              expect(directionsStart.lat).to.equal(testQuery.origin.lat);
              expect(directionsStart.lng).to.equal(testQuery.origin.lng);
              expect(directionsEnd.lat).to.equal(testQuery.destination.lat);
              expect(directionsEnd.lng).to.equal(testQuery.destination.lng);
              done();
            });
        });

        it('should respond with \'path\' as an array of coordinate tuples', (done) => {
          request(app)
            .get('/api/trip')
            .query(testQuery)
            .end((error, response) => {
              expect(error).to.not.exist;
              expect(response.status).to.equal(200);
              expect(response.body).to.have.property('path').that.is.an('array');
              response.body.path.forEach((coord) => {
                expect(coord[0]).to.be.a('number');
                expect(coord[1]).to.be.a('number');
              });
              done();
            });
        });

        it('should have an associated risk with each coordinate tuple in the \'path\' array', (done) => {
          request(app)
            .get('/api/trip')
            .query(testQuery)
            .end((error, response) => {
              response.body.path.forEach((coord) => {
                expect(error).to.not.exist;
                expect(response.status).to.equal(200);
                expect(coord.length).to.equal(3);
                expect(coord[2]).to.be.a('number');
              });
              done();
            });
        });
      });
    });
  });
});
