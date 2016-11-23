const axios = require('axios');
const qs = require('qs');
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
  silent: true,
});

const requestHandler = (request, response) => {
  const tripServerUrl = process.env.TRIP_SERVICE_URL;
  const riskServerUrl = process.env.RISK_SERVICE_URL;
  if (!tripServerUrl) {
    throw new Error('No URL for the Trip Service set in TRIP_SERVICE_URL');
  }
  if (!riskServerUrl) {
    throw new Error('No URL for the Risk Service set in the RISK_SERVICE_URL');
  }

  const queryObj = qs.stringify(request.query);

  // Send query to trip server
  axios.get(`${tripServerUrl}/trip?${queryObj}`)
    .then((tripResponse) => {
      // Pass response from trip server to risk server
      axios.post(`${riskServerUrl}/risk`, {
        point: tripResponse.data.path,
      })
        .then((riskResponse) => {
          const routeObj = tripResponse.data;

          const riskPoints = riskResponse.data.risk;

          // Assign risk points received from risk server to each
          // lat/lng point along the route
          routeObj.path.forEach((coord, index) => {
            coord.push(riskPoints[index]);
          });

          // Send route object with associated risks back to client
          response.status(200).json(routeObj);
        })
        .catch((error) => {
          console.log(error);
          response.status(502).json({
            error: {
              message: `Error trying to retrieve risk rating from risk server: ${error.message}.`,
            },
          });
        });
    })
    .catch((error) => {
      console.log(error);
      response.status(502).json({
        error: {
          message: `Error trying to retrieve directions from trip server: ${error.message}.`,
        },
      });
    });
};

module.exports = requestHandler;
