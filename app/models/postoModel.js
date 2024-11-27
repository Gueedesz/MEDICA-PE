// app/models/postoModel.js

const mongoose = require('mongoose');

const postoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  address: { type: String, required: true }
});

// Verificar se o modelo já foi registrado para evitar erros
module.exports = mongoose.models.Posto || mongoose.model('Posto', postoSchema);
