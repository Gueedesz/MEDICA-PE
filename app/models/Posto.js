const mongoose = require('mongoose');

const postoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Posto = mongoose.model('Posto', postoSchema);
module.exports = Posto;
