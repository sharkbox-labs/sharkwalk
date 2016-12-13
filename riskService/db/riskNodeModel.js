const mongoose = require('mongoose');
require('mongoose-geojson-schema');

mongoose.Promise = global.Promise;

// eslint-disable-next-line new-cap
const riskNodeSchema = new mongoose.Schema({
  risk: {
    type: Number,
    min: [0, 'Risk must be greater than or equal to zero'],
  },
  cnn: {
    type: String,
    index: true,
  },
  location: {
    type: mongoose.Schema.Types.Point,
    required: [true, 'Location is required for a Risk Point'],
  },
  batchId: String,
  edges: Array,
});

riskNodeSchema.index({ location: '2dsphere' }); // enable geo-queries

// eslint-disable-next-line new-cap
module.exports = mongoose.model('RiskNode', riskNodeSchema);
