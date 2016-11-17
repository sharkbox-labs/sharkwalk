const mongoose = require('mongoose');
require('mongoose-geojson-schema');

mongoose.Promise = global.Promise;

// eslint-disable-next-line new-cap
const riskPointSchema = new mongoose.Schema({
  risk: {
    type: Number,
    required: [true, 'Risk is required for a Risk Point'],
    min: [0, 'Risk must be greater than or equal to zero'],
  },
  location: {
    type: mongoose.Schema.Types.Point,
    required: [true, 'Location is required for a Risk Point'],
  },
  batchId: String,
}, {
  timestamps: true,
});

// eslint-disable-next-line new-cap
module.exports = mongoose.model('RiskPoint', riskPointSchema);
