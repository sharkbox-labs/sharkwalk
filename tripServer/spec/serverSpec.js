const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server');

// temporary empty query
const testQuery = {
  origin: {
    lat: 37.7836415,
    lng: -122.409185,
  },
  destination: {
    lat: 37.7811631,
    lng: -122.406077,
  },
};

describe('Trip Server:', () => {
  it('should respond with a 200 status code', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .expect(200, done);
  });
  it('should respond with a json object response body', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.status).to.equal(200);
        expect(response.body).to.be.json;
        done();
      });
  });
  it('should have property "path" in the response body', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('path');
        done();
      });
  });
  it('path should be an array of coordinates', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.status).to.equal(200);
        expect(response.body.path.length).to.be.a('number');
        expect(response.body.path[0].length).to.equal(2);
        expect(response.body.path[0][0]).to.be.a('number');
        done();
      });
  });

  it('first value of path should be origin coordinates', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.status).to.equal(200);
        const firstValue = response.body.path[0];
        const round = number => Math.round(number * 100000) / 100000;
        expect(firstValue[0]).to.equal(round(testQuery.origin.lat));
        expect(firstValue[1]).to.equal(round(testQuery.origin.lng));
        done();
      });
  });
  it('should have property "route" in the response body', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('route');
        done();
      });
  });
});
