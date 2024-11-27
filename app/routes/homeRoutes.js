const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const Posto = require('../models/Posto'); // Importar o modelo do Posto

// Rota para a página inicial
router.get('/', homeController.getHomePage);

// Rota para obter todos os postos do banco de dados
router.get('/api/postos', async (req, res) => {
    try {
      // Buscar apenas postos com lat e lon definidos e válidos
      const postos = await Posto.find({
        lat: { $type: "double" }, // Certifica que é um número
        lon: { $type: "double" }
      });
      res.json(postos);
    } catch (err) {
      console.error('Erro ao buscar postos:', err);
      res.status(500).send('Erro ao obter os postos.');
    }
  });
  

module.exports = router;
