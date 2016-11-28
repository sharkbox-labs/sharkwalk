const axios = require('axios');
const getPaths = require('./tripHelpers.js').getPaths;

// risk service sends array of objects with format below:s
//
// body is:
// [{
//   origin: [lat, long],
//   waypoints: [[lat, long], [lat, long], [lat, long]....etc],
//   destination: [lat, long],
// },
// {
//   origin: [lat, long],
//   waypoints: [[lat, long], [lat, long], [lat, long]],
//   destination: [lat, long],
// }]

// response is:
// [{
//   route: <Google maps route object>,
//   path: [[lat, long], [lat, long], [lat, long].....etc], <-- chopped up equidistant points
// },
// {
//   route: <Google maps route object>,
//   path: [[lat, long], [lat, long], [lat, long].....etc],
// }]

const requestRoutes = (origin, destination, waypoints) => {
  const googleMapsRequestURL = 'https://maps.googleapis.com/maps/api/directions/json?';
  return axios.get(googleMapsRequestURL, {
    params: {
      origin,
      destination,
      mode: 'walking',
      key: APIKEY,
      alternatives: true,
      waypoints,
    },
  })
  .then(response => response.data);
};

