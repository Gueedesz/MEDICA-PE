const Posto = require('../models/Posto'); // Importar o modelo Posto

exports.getHomePage = async (req, res) => {
  try {
    const postos = await Posto.find(); // Buscar todos os postos no banco de dados
    res.render('home', { title: 'Postos de Saúde', postos }); // Renderizar a página inicial com os dados
  } catch (error) {
    console.error('Erro ao carregar a página inicial:', error);
    res.render('home', { title: 'Erro', postos: [] }); // Envia um array vazio caso haja erro
  }
};

