const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const session = require('express-session');
const connectDB = require('./app/config/database'); // Importar a função que conecta ao banco de dados

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
connectDB(); // Chamar a função que faz a conexão com o banco de dados

// Inicializa o app Express
const app = express();

// Configuração do Handlebars como template engine com permissões para acessar propriedades
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'app', 'views', 'layouts'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app', 'views'));

// Middleware para processar dados do corpo da requisição
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
app.use(session({
  secret: 'gdgihwrouighrwogu2hgo2goi',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// Middleware para lidar com JSON
app.use(express.json());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Importar e usar as rotas
const homeRoutes = require('./app/routes/homeRoutes');
const estoqueRoutes = require('./app/routes/estoqueRoutes');
const aboutRoutes = require('./app/routes/aboutRoutes');
const helpRoutes = require('./app/routes/helpRoutes');
const loginRoutes = require('./app/routes/loginRoutes');
app.use('/sobrenos', aboutRoutes);
app.use('/', homeRoutes);
app.use('/ajuda', helpRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/login', loginRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3000;

app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).send('Erro interno do servidor');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

