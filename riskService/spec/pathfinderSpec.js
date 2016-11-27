const pathfinder = require('../riskHelpers/pathfinderHelpers');
const db = require('../db/connection');

const generatePolyline = function generatePolyline(origin, waypoints, destination) {
  const coordinates = [];
  coordinates.push(origin.coordinates);
  waypoints.forEach(waypoint => coordinates.push(waypoint.geometry.coordinates));
  coordinates.push(destination.coordinates);
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates,
    },
  };
};

describe('Pathfinding', () => {
  describe('Pathfinder helpers', () => {
    it('should find a path', () => {
      const points = [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [
              -122.41988182067871,
              37.7754638359482,
            ],
          },
        },
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [
              -122.40949630737303,
              37.80123932755579,
            ],
          },
        },
      ];
      const start = Date.now();
      return pathfinder.findPathway(points[0].geometry, points[1].geometry, 10)
        .then((result) => {
          console.log(`Found result in ${(Date.now() - start) / 1000} s`);
          console.log(JSON.stringify(generatePolyline(points[0].geometry, result, points[1].geometry), null, 1));
        });
    }).timeout(20000);
  });
});
