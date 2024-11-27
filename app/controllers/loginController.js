const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require('../config/databasemysql'); // Conexão com o banco de dados

// Carregar variáveis do .env
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// Renderizar a página de login
exports.getLoginPage = (req, res) => {
    res.render('login', { title: 'Conecte-se' });
};

// Trata o postlogin
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, preencha todos os campos!' });
    }

    try {
        const [results] = await mysqlConnection.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado. Contate seu supervisor!' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha inválida.' });
        }

        // Salvar sessão do usuário
        req.session.user = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        // Retornar sucesso via JSON
        return res.status(200).json({ message: 'Login bem-sucedido!' });
    } catch (err) {
        console.error('Erro no login:', err);
        return res.status(500).json({ error: 'Erro interno do servidor. Tente novamente.' });
    }
};



exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar a sessão:', err);
            return res.status(500).send('Erro ao fazer logout.');
        }
        res.redirect('/'); // Redireciona para a página de login após logout
    });
};

