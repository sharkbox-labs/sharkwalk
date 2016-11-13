const expect = require('chai').expect;
const sfData = require('../assessmentWorker/sanFranciscoDataConnector');

/* eslint-disable no-unused-expressions */

describe('San Francisco crime reports', () => {
  describe('Fetching crime reports', () => {
    it('should fetch crime reports', () => {
      const bounds = [
        {
          geometry: {
            type: 'Point',
            coordinates: [-122.4204826, 37.7963668],
          },
        },
        {
          geometry: {
            type: 'Point',
            coordinates: [-122.3955917, 37.7804946],
          },
        },
      ];
      return sfData.fetchCrimeReports(bounds, '1 month ago', 2)
        .then((reports) => {
          expect(reports).to.be.an('Array');
          expect(reports[0]).to.include.keys(['pddistrict', 'x', 'y', 'resolution']);
        })
        .catch((error) => {
          throw error;
        });
    });
  });
});
