const axios = require('axios');
const qs = require('qs');

const requestHandler = (request, response) => {
  const queryObj = qs.stringify(request.query);

  // Send query to trip server
  axios.get(`/trip?${queryObj}`)
    .then((tripResponse) => {
      const routeObj = qs.stringify(tripResponse.data);
      // Pass response from trip server to risk server
      axios.get(`/risk?${routeObj}`)
        .then((riskResponse) => {
          // Send fully decorated object back to client
          response.status(200).json(riskResponse.data);
        })
        .catch((error) => {
          response.status(502).json({
            error: {
              message: 'Failed to retrieve risk rating from risk server',
            },
          });
        });
    })
    .catch((error) => {
      response.status(502).json({
        error: {
          message: 'Failed to retrieve directions from trip server',
        },
      });
    });
};

module.exports = requestHandler;
