const request = require('supertest');
const expect = require('chai').expect;
const app = require('../server');

describe('Integration Server', () => {
  it('should respond with a 200 status code on / GET', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('should respond with a 200 status code on /api GET', (done) => {
    request(app)
      .get('/api')
      .expect(200, done);
  });
});
