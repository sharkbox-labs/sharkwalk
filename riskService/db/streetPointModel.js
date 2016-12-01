const mongoose = require('mongoose');
require('mongoose-geojson-schema');

mongoose.Promise = global.Promise;

// eslint-disable-next-line new-cap
const streetPointSchema = new mongoose.Schema({
  f_node_cnn: {
    type: String,
  },
  t_node_cnn: {
    type: String,
  },
  location: {
    type: mongoose.Schema.Types.Point,
    required: [true, 'Location is required for a Risk Point'],
  },
  batchId: String,
});

streetPointSchema.index({ location: '2dsphere' }); // enable geo-queries

// eslint-disable-next-line new-cap
module.exports = mongoose.model('StreetPoint', streetPointSchema);
