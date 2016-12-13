const StreetPoint = require('./streetPointModel');

/**
 * Methods for interacting with Street Points.
 * @module streetPointController
 */

/**
 * Saves multiple street nodes to the database.
 * @param {Object[]} points - An array of street points.
 * @param {number} points[].f_node_cnn
 * @param {number} points[].t_node_cnn
 * @param {GeoJSON Point} location - A GeoJSON Point representing the location.
 * @param {string} [batchId=null] - The batch identifier. Used to group points
 * generated at the same time.
 * @returns {Promise} A promise which resolves to the created instances.
 */
const createStreetPoints = function createStreetPoints(points, batchId) {
  const batchedPoints = points.map(point => Object.assign(point, { batchId }));
  return StreetPoint.create(batchedPoints);
};

/**
 * Find street points near a given point.
 * @param  {GeoJSON Point} point - The point to look around.
 * @param {number} distance - The max distance (in meters) the risk points
 * can be from the input `point`.
 * @return {Promise} A promise which resolves to the street points near
 * the `point`.
 */
const findStreetPointsNear = function findStreetPointsNear(point, distance = 100) {
  return StreetPoint.find({
    location: {
      $near: {
        $geometry: point,
        $maxDistance: distance,
        $minDistance: 0,
      },
    },
  }).exec();
};

module.exports = {
  createStreetPoints,
  findStreetPointsNear,
};
