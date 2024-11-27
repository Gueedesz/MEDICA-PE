const express = require('express');
const router = express.Router();
const helpController = require('../controllers/helpController');

// Rota para a página Help
router.get('/', helpController.getHelpPage);

module.exports = router;
