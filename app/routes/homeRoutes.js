const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const Posto = require('../models/Posto');

// Rota para a página inicial
router.get('/', homeController.getHomePage);

// Rota para obter todos os postos do banco de dados
router.get('/api/postos', async (req, res) => {
  try {
    const postos = await Posto.find({
      lat: { $type: "double" },
      lon: { $type: "double" }
    });
    if (!postos || postos.length === 0) {
      return res.status(404).json({ message: 'Nenhum posto com coordenadas válidas encontrado.' });
    }
    res.json(postos);
  } catch (err) {
    console.error('Erro ao buscar postos:', err);
    res.status(500).json({ message: 'Erro ao obter os postos.', error: err.message });
  }
});

module.exports = router;
