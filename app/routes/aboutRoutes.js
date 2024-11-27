const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Rota para a página Sobre Nós
router.get('/', aboutController.getAboutPage);

module.exports = router;
