const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const session = require('express-session');

// Carregar variáveis de ambiente
dotenv.config();

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nome_do_banco'
});

// Conectar ao MySQL
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado ao MySQL com sucesso!');
});

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

// Tornar a conexão com o banco de dados disponível para as rotas
app.use((req, res, next) => {
  req.db = db; // Adiciona a conexão ao objeto req para uso nas rotas
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

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).send('Erro interno do servidor');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
