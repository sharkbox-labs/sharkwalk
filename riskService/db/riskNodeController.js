const RiskNode = require('./riskNodeModel');
const logger = require('../logger');

const buildCache = function buildCache(model) {
  const cache = {};
  cache.get = function get(id) {
    return this[id];
  };

  model.find({}).exec().then((records) => {
    records.forEach((record) => {
      cache[record.cnn] = record;
    });
    logger.info(`Built risk node cache with ${records.length} records`);
  });
  return cache;
};

const cache = buildCache(RiskNode);

/**
 * Methods for interacting with Risk Nodes.
 * @module riskNodeController
 */

/**
 * Saves multiple risk points to the database.
 * @param {Object[]} points - An array of risk nodes.
 * @param {number} points[].risk - The risk level for the point.
 * @param {GeoJSON Point} location - A GeoJSON Point representing the location.
 * @param {string} [batchId=null] - The batch identifier. Used to group points
 * generated at the same time.
 * @returns {Promise} A promise which resolves to the created instances.
 */
const createRiskNodes = function createRiskNodes(points, batchId) {
  const batchedPoints = points.map(point => Object.assign(point, { batchId }));
  return RiskNode.create(batchedPoints);
};

const findRiskNodeByCnn = function findRiskNodeByCnn(cnn) {
  const cachedNode = cache.get(cnn);
  if (cachedNode) {
    return new Promise(resolve => resolve(cachedNode));
  }
  return RiskNode.findOne({ cnn }).exec();
};

/**
 * Find risk nodes near a given point
 * @param  {GeoJSON Point} point - The point to look around.
 * @param {number} distance - The max distance (in meters) the risk points
 * can be from the input `point`.
 * @return {Promise} A promise which resolves to the risk points near
 * the `point`.
 */
const findRiskNodesNear = function findRiskNodesNear(point, distance = 100) {
  return RiskNode.find({
    location: {
      $near: {
        $geometry: point,
        $maxDistance: distance,
        $minDistance: 0,
      },
    },
  }).exec()
  .then(nodes => nodes);
};

const findRiskNodesNearCnn = function findRiskNodesNearCnn(cnn, distance = 100) {
  return findRiskNodeByCnn(cnn)
    .then((node) => {
      if (!node) {
        throw new Error(`No node with CNN: ${cnn} found.`);
      }
      return findRiskNodesNear(node.location, distance);
    })
    .then(nodes => nodes);
};

const findRiskNodeAndCacheNeighbors = function findRiskNodeAndCacheNeighbors(cnn) {
  return findRiskNodeByCnn(cnn)
    .then((node) => {
      if (!node) {
        throw new Error(`No node with CNN: ${cnn} found.`);
      }
      return node;
    });
};

const findRiskNodesWithinPolygon = function findRiskPointsWithinPolygon(polygon) {
  return RiskNode.find({
    location: {
      $geoWithin: {
        $geometry: polygon,
      },
    },
  }, {
    location: 1,
    risk: 1,
    _id: 0,
  });
};

module.exports = {
  createRiskNodes,
  findRiskNodeByCnn,
  findRiskNodesNear,
  findRiskNodesNearCnn,
  findRiskNodeAndCacheNeighbors,
  findRiskNodesWithinPolygon,
};
