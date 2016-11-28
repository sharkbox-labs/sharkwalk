const path = require('path');
require('dotenv').config({
  silent: true,
  path: path.join(__dirname, '../../.env'),
});
const request = require('axios');
const turf = require('@turf/turf');
const logger = require('../logger');
const riskGenerator = require('./riskGenerator');
const shortid = require('shortid');
const db = require('../db/connection');

const riskNodeController = require('../db/riskNodeController');

const fetchStreetNodes = function fetchStreetNodes(bounds) {
  const sfSteetNodesUrl = 'https://data.sfgov.org/resource/stqf-m6iw.json';
  const envelope = turf.envelope(bounds);
  const [minX, minY, maxX, maxY] = turf.bbox(envelope); // eslint-disable-line prefer-const
  return request(sfSteetNodesUrl, {
    params: {
      $where: `within_box(the_geom, ${minY}, ${minX}, ${maxY}, ${maxX})`,
      $limit: 50000,
      $select: 'cnn, the_geom',
      $$app_token: process.env.SF_CRIME_APP_TOKEN,
    },
  })
  .then((response) => {
    if (response.status === 429) {
      logger.warn('San Francisco street nodes have been throttled (HTTP 429)');
      throw new Error('San Francisco street nodes throttled');
    }
    const results = response.data;
    logger.info(`Retrieved ${results.length} San Francisco street nodes.`);
    return results;
  });
};

const fetchStreetSegments = function fetchStreetSegments(bounds) {
  const basemapUrl = 'https://data.sfgov.org/resource/7hfy-8sz8';
  const envelope = turf.envelope(bounds);
  const [minX, minY, maxX, maxY] = turf.bbox(envelope); // eslint-disable-line prefer-const
  return request(basemapUrl, {
    params: {
      $where: `within_box(geometry, ${minY}, ${minX}, ${maxY}, ${maxX})`,
      $limit: 50000,
      $select: 't_node_cnn, f_node_cnn, streetname',
      $$app_token: process.env.SF_CRIME_APP_TOKEN,
    },
  })
  .then((response) => {
    if (response.status === 429) {
      logger.warn('San Francisco street segments have been throttled (HTTP 429)');
      throw new Error('San Francisco street segments throttled');
    }
    const results = response.data;
    logger.info(`Retrieved ${results.length} San Francisco street segments.`);
    return results;
  });
};

const getEdgesForNode = function getEdgesForNode(node, nodes, segments) {
  const nodeCnn = node.cnn;
  const edges = [];
  segments.forEach((segment) => {
    const newEdge = {};
    if (segment.f_node_cnn === nodeCnn) {
      newEdge.cnn = segment.t_node_cnn;
      newEdge.streetname = segment.streetname;
    } else if (segment.t_node_cnn === nodeCnn) {
      newEdge.cnn = segment.f_node_cnn;
      newEdge.streetname = segment.streetname;
    }
    if (newEdge.cnn) {
      let edgeNode = null;
      nodes.forEach((searchNode) => {
        if (searchNode.cnn === newEdge.cnn) {
          edgeNode = searchNode;
        }
      });
      if (!edgeNode) {
        logger.warn(`Edge node not found for cnn: ${node.cnn}, edge cnn: ${newEdge.cnn}, node location: ${JSON.stringify(node.the_geom)}. Unable to compute distance. Skipping edge.`);
        return;
      }
      const distance = turf.distance(node.the_geom, edgeNode.the_geom, 'kilometers') * 1000;
      newEdge.distance = distance;
      edges.push(newEdge);
    }
  });
  return edges;
};


/**
 * Takes an area and finds all the street intersections (nodes) in San Francisco
 * in that area.
 * @module worker
 * @param  {GeoJSON Feature Collection} area - A GeoJSON feature collection
 * representing the area bounds. Visit [geojson.io](http://geojson.io/) for
 * an easy-to-use GUI to create the object.
 * @return {Promise} Resolves to an array of the created records.
 */
module.exports = function graphWorker(area, keepAlive = false) {
  const batchId = shortid.generate();
  return Promise.all([fetchStreetNodes(area), fetchStreetSegments(area)])
    .then((results) => {
      const [nodes, segments] = results;
      return riskGenerator.generateRiskForPoints(nodes.map(node => node.the_geom))
        .then((risks) => {
          const nodesWithEdgesAndRisk = nodes.map((node, i) => {
            const edges = getEdgesForNode(node, nodes, segments);
            return Object.assign({}, node, { edges }, { risk: risks[i] });
          });
          return nodesWithEdgesAndRisk;
        });
    })
    .then((nodes) => {
      logger.info(`Generated ${nodes.length} nodes.`);
      return riskNodeController.createRiskNodes(nodes.map(node => ({
        cnn: node.cnn,
        location: node.the_geom,
        edges: node.edges,
        risk: node.risk,
      })), batchId);
    })
    .then((records) => {
      logger.info(`Saved ${records.length} risk nodes in batch ${batchId}`);
      if (!keepAlive) db.close();
      return records;
    })
    .catch((error) => {
      logger.error(`Error ${error.message} with risk nodes in ${batchId}`);
      if (!keepAlive) db.close();
      throw error;
    });
};
