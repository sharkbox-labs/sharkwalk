// A script that reads the risk points out of the
// database and exports a geoJSON file suitable to
// visualize the data. Open the file at http://geojson.io

const fs = require('fs');
const turf = require('@turf/turf');
const path = require('path');
const colorcolor = require('colorcolor');
require('dotenv').config({ silent: false, path: path.join(__dirname, '../../.env') });

const RiskPoint = require('../db/riskNodeModel');
const db = require('../db/connection');

const MAX_RISK = 400;

const numberToRGBGreenRed = function numberToRGBGreenRed(num) {
  let hue = 120 - (120 * num);
  if (hue < 0) hue = 0;
  if (hue > 120) hue = 120;
  const colorHex = colorcolor(`hsl(${Math.round(hue)}, 100%, 50%)`, 'hex');
  return `${colorHex}`;
};

const recordToGeoJSON = (record) => {
  const point = turf.feature(record.location);
  point.properties = {};
  point.properties['marker-symbol'] = '';
  point.properties['marker-size'] = 'small';
  point.properties['marker-color'] = numberToRGBGreenRed(record.risk / MAX_RISK);
  return point;
};

RiskPoint.find({}).exec()
  .then(records => records.map(record => recordToGeoJSON(record)))
  .then(points => turf.featureCollection(points))
  .then((collection) => {
    fs.writeFileSync('./visualization.geojson', JSON.stringify(collection, null, 2), 'utf-8');
    db.close();
  })
  .catch((err) => {
    console.log(err);
    db.close();
  });
