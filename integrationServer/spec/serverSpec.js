const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server');

const testQuery = {
  origin: {
    lat: 37.7840081,
    long: -122.406077,
  },
  destination: {
    lat: 37.7811631,
    long: -122.409185,
  },
};

describe('Integration Server:', () => {
  it('should respond with a 200 status code on / GET', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  describe('API', () => {
    it('should respond with a 200 status code on /api GET', (done) => {
      request(app)
        .get('/api')
        .expect(200, done);
    });

    it('should have "routes" in the response body', (done) => {
      request(app)
        .get('/api')
        .query(testQuery)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('routes');
          done();
        });
    });

    it('should respond with routes in an array', (done) => {
      request(app)
        .get('/api')
        .query(testQuery)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('routes').that.is.an('array');
          done();
        });
    });

    it('should have "risk" in the response body', (done) => {
      request(app)
        .get('/api')
        .query(testQuery)
        .end((error, response) => {
          expect(error).to.not.exist;
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property('risk');
          done();
        });
    });

    /*
    // test for data type of each route?

    it('should respond with each route as an object', (done) => {

    });

    // test for properties expected in each route object?

    it('should have <insert properties> in each route object ', (done) => {

    });

    // test for data type of each property in route object?

    it('should respond with risk as an object', (done) => {

    });

    // test for properties expected in risk object?

    it('should respond with total risk, average risk, and instantaneous risk', (done) => {

    });

    // test for data type of each property in risk object
    */
  });
});
