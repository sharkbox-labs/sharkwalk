const expect = require('chai').expect;
const sfData = require('../assessmentWorker/sanFranciscoDataConnector');

/* eslint-disable no-unused-expressions, arrow-body-style */

describe('San Francisco crime reports', () => {
  describe('Fetching crime reports', () => {
    const bounds = {
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
                  -122.41803646087645,
                  37.78126410541595,
                ],
                [
                  -122.41803646087645,
                  37.7975770425844,
                ],
                [
                  -122.39576339721678,
                  37.7975770425844,
                ],
                [
                  -122.39576339721678,
                  37.78126410541595,
                ],
                [
                  -122.41803646087645,
                  37.78126410541595,
                ],
              ],
            ],
          },
        },
      ],
    };

    it('should fetch crime reports', () => {
      return sfData.fetchCrimeReports(bounds, '1 month ago', 2)
        .then((reports) => {
          expect(reports).to.be.an('Array');
          expect(reports[0]).to.include.keys(['category', 'date', 'descript', 'location']);
        });
    });

    it('should not require a limit', () => {
      return sfData.fetchCrimeReports(bounds, '1 month ago')
        .then((reports) => {
          expect(reports).to.be.an('Array');
          expect(reports[0]).to.include.keys(['category', 'date', 'descript', 'location']);
        });
    });
  });
});
