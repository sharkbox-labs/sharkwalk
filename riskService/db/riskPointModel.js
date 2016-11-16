const mongoose = require('mongoose');

const riskPointSchema = mongoose.Schema({
  risk: Number,
  location: mongoose.Schema.Types.Point,
  batch: String,
});

module.exports = mongoose.Model('RiskPoint', riskPointSchema);
