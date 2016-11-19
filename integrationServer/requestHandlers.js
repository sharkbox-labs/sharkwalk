const axios = require('axios');
const qs = require('qs');

const requestHandler = (request, response) => {
  const tripServerUrl = 'http://localhost:3001';

  const riskServerUrl = 'http://localhost:3002';

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
              message: 'Failed to retrieve risk rating from risk server',
            },
          });
        });
    })
    .catch((error) => {
      console.log(error);
      response.status(502).json({
        error: {
          message: 'Failed to retrieve directions from trip server',
        },
      });
    });
};

module.exports = requestHandler;
