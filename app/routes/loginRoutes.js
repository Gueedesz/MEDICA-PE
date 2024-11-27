const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Rota para exibir a página de login
router.get('/', loginController.getLoginPage);

// Rota para autenticar o login
router.post('/', loginController.postLogin);

router.post('/logout', loginController.logout);


module.exports = router;
