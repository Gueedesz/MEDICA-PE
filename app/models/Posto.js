const mongoose = require('mongoose');

const postoSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Especifica que _id é uma string
  name: String,
  lat: Number,
  lon: Number,
  address: String
}, { _id: false }); // Desativa a criação automática de _id como ObjectId

module.exports = mongoose.model('Posto', postoSchema);
