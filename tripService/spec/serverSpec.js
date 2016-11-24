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
  it('should respond with trips', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.body.error).to.not.exist;
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('Array');
        expect(response.body[0]).to.have.keys(['route', 'path']);
        expect(response.body[0].route).to.contain.all.keys(['legs', 'copyrights', 'bounds']);
        expect(response.body[0].path).to.be.an('Array');
        expect(response.body[0].path[0]).to.be.an('Array');
        expect(response.body[0].path[0][0]).to.be.a('number');
        done();
      });
  });
  it('path should be an array of arrays of coordinates', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.status).to.equal(200);
        expect(response.body[0].path[0]).to.be.an('Array');
        expect(response.body[0].path[0].length).to.be.equal(2);
        expect(response.body[0].path[0][0]).to.be.a('number');
        expect(response.body[0].path[0][1]).to.be.a('number');
        done();
      });
  });
  it('path should be have the same origin as the query', (done) => {
    request(app)
      .get('/trip')
      .query(testQuery)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response.status).to.equal(200);
        expect(response.body[0].path[0]).to.be.an('Array');
        expect(response.body[0].path[0].length).to.be.equal(2);
        expect(response.body[0].path[0][0]).to.equal(37.78364);
        expect(response.body[0].path[0][1]).to.equal(-122.40918);
        expect(response.body[1].path[0][0]).to.equal(37.78364);
        expect(response.body[1].path[0][1]).to.equal(-122.40918);
        done();
      });
  });
});
