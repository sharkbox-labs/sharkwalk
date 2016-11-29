const riskNodeController = require('../db/riskNodeController');
const turf = require('@turf/turf');
const BinaryHeap = require('../binaryHeap/binaryHeap');

/**
 * Changes a node to a GeoJSON feature we can work with.
 * @param  {Object} node The node record from the database.
 * @return {GeoJSON Feature}      The node, but in GeoJSON.
 */
const transformNodeToFeature = function transformNodeToFeature(node) {
  return {
    type: 'Feature',
    geometry: node.location,
    properties: {
      risk: node.risk,
      edges: node.edges,
      cnn: node.cnn,
    },
  };
};

/**
 * The hueristic function for the A* algorithm.
 * @param  {GeoJSON Point} current    The current location.
 * @param  {GeoJSON Point} target     The goal location.
 * @param  {Number} riskWeight The weighting factor for crime risk. See the
 * findPathway function documentation for an explanation.
 * @return {Number}            The hueristic value.
 */
const hueristic = function hueristic(current, target, riskWeight = 1) {
  // distance + distance * aveargecrime * weight
  const dist = turf.distance(current, target, 'kilometers') * 1000;
  return dist + (dist * (50 / 600) * riskWeight);
  // 50 is approimately the risk for a lot of the city. Normalizing to a
  // max risk of 600 (although a few areas are higher)
};

/**
 * Finds a node on the graph that is near the point and on the way to
 * the goal.
 * @param  {GeoJSON Point} point The location you would like an entry node near.
 * @param  {GeoJSON Point} goal  The ultimate destination you are trying to reach.
 * @return {Promise}       A promise that resolves to the jumpoff point graph node.
 */
const getJumpoffNode = function getJumpoffNode(point, goal) {
  return riskNodeController.findRiskNodesNear(point, 200)
    .then((nodes) => {
      if (!nodes.length) {
        throw new Error(`Could not find a node near ${JSON.stringify(point)}.`);
      }
      nodes.map((node) => {
        const fScore = hueristic(point, node.location) + hueristic(node.location, goal);
        return Object.assign(node, { f: fScore });
      });
      let joIndex;
      let minF = Infinity;
      for (let i = 0; i < nodes.length; i += 1) {
        if (nodes[i].f < minF) {
          joIndex = i;
          minF = nodes[i].f;
        }
      }
      return transformNodeToFeature(nodes[joIndex]);
    });
};


const astarifyNode = function astarifyNode(node) {
  const astar = {
    f: 0,
    g: 0,
    h: 0,
    visited: false,
    closed: false,
    parent: null,
  };
  const result = Object.assign({}, node);
  result.properties.astar = astar;
  return result;
};

const computeCost = function computeCost(distance, risk, riskWeight) {
  // normalizing risk by saying the highest value is 600 (there are one
  // or two nodes that are higher but they seem odd outliers)
  return distance + (distance * (risk / 600) * riskWeight);
};

/**
 * Gets a node from the heap (used for A*), or, if it isn't in the heap,
 * from the database.
 * @param  {number} cnn  The CNN identifier of the node.
 * @param  {Object} heap A binary heap of nodes.
 * @return {Promise}      Resolves to the node with `cnn`.
 */
const getNodeFromHeapOrDb = function getNodeFromHeapOrDb(cnn, heap) {
  const ind = heap.content.reduce((foundInd, node, i) => {
    if (node.properties.cnn === cnn) {
      return i;
    }
    return foundInd;
  }, -1);
  if (ind >= 0) {
    return new Promise(resolve => resolve(heap.content[ind]));
  }
  return riskNodeController.findRiskNodeAndCacheNeighbors(cnn)
    .then(node => transformNodeToFeature(node))
    .then(node => astarifyNode(node));
};

const processHeap = function processHeap(end, riskWeight, openHeap) {
  if (openHeap.size() === 0) {
    return null;
  }
  const currentNode = openHeap.pop();
  if (currentNode.properties.cnn === end.properties.cnn) {
    return currentNode;
  }

  currentNode.properties.astar.closed = true;

  const edges = currentNode.properties.edges;
  return Promise.all(edges.map(edge => getNodeFromHeapOrDb(edge.cnn, openHeap)))
    .then((neighbors) => {
      for (let i = 0; i < neighbors.length; i += 1) {
        const neighbor = neighbors[i];
        if (neighbor.properties.astar.closed) {
          continue; // eslint-disable-line no-continue
        }
        const gScore = currentNode.properties.astar.g +
          computeCost(edges[i].distance, neighbor.properties.risk, riskWeight);
        const beenVisited = neighbor.properties.astar.visited;

        if (!beenVisited || gScore < neighbor.properties.astar.g) {
          neighbor.properties.astar.visited = true;
          neighbor.properties.astar.parent = currentNode;
          neighbor.properties.astar.h =
            neighbor.properties.astar.h || hueristic(neighbor, end, riskWeight);
          neighbor.properties.astar.g = gScore;
          neighbor.properties.astar.f = neighbor.properties.astar.g + neighbor.properties.astar.h;
          if (!beenVisited) {
            openHeap.push(neighbor);
          } else {
            openHeap.rescoreElement(neighbor);
          }
        }
      }
      return processHeap(end, riskWeight, openHeap);
    });
};

const buildPathwayFromEnd = function buildPathwayFromEnd(endNode) {
  let currentNode = endNode;
  const pathway = [];
  while (currentNode) {
    pathway.push(currentNode);
    currentNode = currentNode.properties.astar.parent;
  }
  return pathway.reverse();
};

/**
 * Finds the street two nodes have in common
 * @param  {Object} a The first node
 * @param  {Object} b The second node
 * @return {String}   The streetname the nodes share.
 */
const getStreetname = function getStreetname(a, b) {
  const aEdges = a.properties.edges;
  for (let i = 0; i < aEdges.length; i += 1) {
    const edge = aEdges[i];
    if (edge.cnn === b.properties.cnn) {
      return edge.streetname;
    }
  }
  return null;
};

/**
 * Takes an array of path points and eliminates those on the same street
 * (i.e., the points that are not turnpoints). Removes astar and graph data from the points.
 * @param  {Object[]} pathway The full pathway.
 * @return {Object[]}         The clean pathway.
 */
const cleanPathway = function cleanPathway(pathway) {
  const cleanPath = [];
  cleanPath.push(pathway[0]);
  for (let i = 1; i < pathway.length - 1; i += 1) {
    if (getStreetname(pathway[i - 1], pathway[i]) !== getStreetname(pathway[i], pathway[i + 1])) {
      cleanPath.push(pathway[i]);
    }
  }
  cleanPath.push(pathway[pathway.length - 1]);
  return cleanPath.map((waypoint) => {
    const cleanPoint = {};
    cleanPoint.type = waypoint.type;
    cleanPoint.geometry = waypoint.geometry;
    cleanPoint.properties = {};
    cleanPoint.properties.risk = waypoint.properties.risk;
    return cleanPoint;
  });
};

/**
 * Uses A* pathfinding to find directions between two points, but factors in crime risk
 * along the way to optimize safety as well as travel distance.
 * @param  {GeoJSON Point} origin      The starting point of the route.
 * @param  {GeoJSON Point} destination The ending point of the route.
 * @param  {number} riskWeight  The weighting factor of the risk, or, how far out of your
 * way you're willing to go to avoid a risky area. A zero value means risk won't be factored
 * in at all. A value of 1 means that if you were going to walk 100m through the riskiest
 * part of town, you're willing to walk an extra 100m to avoid the area. A weight of 2 means
 * you're willing to walk an extra 200m to avoid the area.
 * @return {Promise}             Resolves to an array of waypoints between the origin and
 * destination that describe the optimal path to take given your riskWeight.
 */
const findPathway = function findPathway(origin, destination, riskWeight) {
  // See: https://github.com/bgrins/javascript-astar
  return Promise.all([getJumpoffNode(origin, destination), getJumpoffNode(destination, origin)])
    .then(([start, end]) => {
      const openHeap = new BinaryHeap(node => node.properties.astar.f);
      const closestNode = astarifyNode(start);
      closestNode.properties.astar.h = hueristic(closestNode, end);
      openHeap.push(closestNode);
      return processHeap(end, riskWeight, openHeap)
        .then(endNode => cleanPathway(buildPathwayFromEnd(endNode)));
    });
};

const precisionRound = function precisionRound(number, precision) {
  const factor = Math.pow(10, precision); // eslint-disable-line no-restricted-properties
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

const pointToLatLngArray = function pointToLatLngArray(point) {
  const lonLat = turf.getCoord(point);
  return [precisionRound(lonLat[1], 4), precisionRound(lonLat[0], 4)];
};

const findPathwayAroundRiskWeight =
  function findPathwayAroundRiskWeight(origin, destination, riskWeight, tries = 0) {
    return findPathway(origin, destination, riskWeight)
      .then((pathway) => {
        if (pathway.length < 24) {
          return {
            origin: pointToLatLngArray(origin),
            destination: pointToLatLngArray(destination),
            waypoints: pathway.map(point => pointToLatLngArray(point)),
            riskWeight,
          };
        }
        if (tries > 5) {
          throw new Error('Could not find a risk path with less than 24 waypoints');
        }
        return findPathwayAroundRiskWeight(origin, destination, riskWeight + 1, tries + 1);
      });
  };

module.exports = {
  findPathway,
  findPathwayAroundRiskWeight,
};
