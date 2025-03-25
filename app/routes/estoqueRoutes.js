const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/commentModel');
const Posto = require('../models/postoModel');
const moment = require('moment-timezone');
moment.tz.setDefault('America/Sao_Paulo');
moment.locale('pt-br');

// Rota para filtrar comentários (pesquisa de remédios)
router.post('/:postoId/pesquisar-remedio', async (req, res) => {
  const { medicamento } = req.body;
  const { postoId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postoId)) {
      return res.status(400).send('ID do posto inválido.');
    }

    const regex = new RegExp(medicamento, 'i');
    const comments = await Comment.find({
      postoId,
      comment: { $regex: regex },
    });

    const formattedComments = comments.map(comment => ({
      ...comment.toObject(),
      formattedDate: moment(comment.createdAt).format('DD/MM/YYYY HH:mm'),
    }));

    const posto = await Posto.findById(postoId);

    res.render('estoque', {
      title: 'Verificar Estoque',
      posto,
      comments: formattedComments,
      medicamento,
    });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).send('Erro ao buscar comentários.');
  }
});

// Rota para a página de estoque
router.get('/:postoId', async (req, res) => {
  const { postoId } = req.params;

  if (postoId === 'comentar' || !mongoose.Types.ObjectId.isValid(postoId)) {
    return res.render('estoque', {
      title: 'Verificar Estoque',
      posto: { name: 'Posto Desconhecido' },
      comments: [],
      errorMessage: 'ID do posto inválido. Por favor, selecione um posto válido.'
    });
  }

  try {
    const posto = await Posto.findById(postoId);
    if (!posto) {
      throw new Error(`Posto ${postoId} não encontrado.`);
    }

    const comments = await Comment.find({ postoId });
    const formattedComments = comments.map(comment => ({
      ...comment.toObject(),
      formattedDate: moment(comment.createdAt).format('DD/MM/YYYY HH:mm'),
    }));

    res.render('estoque', {
      title: 'Verificar Estoque',
      posto,
      comments: formattedComments,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do posto:', error);
    res.render('estoque', {
      title: 'Verificar Estoque',
      posto: { name: 'Posto Desconhecido' },
      comments: [],
      errorMessage: 'Erro ao buscar dados do posto. Tente novamente mais tarde.',
    });
  }
});

// Rota para a página de comentar
router.get('/:postoId/comentar', async (req, res) => {
  const { postoId } = req.params;

  if (postoId === 'comentar' || !mongoose.Types.ObjectId.isValid(postoId)) {
    return res.render('comment', {
      title: 'Adicionar Comentário',
      posto: { name: 'Posto Desconhecido' },
      comments: [],
      errorMessage: 'ID do posto inválido. Por favor, selecione um posto válido.'
    });
  }

  try {
    const posto = await Posto.findById(postoId);
    if (!posto) {
      throw new Error(`Posto ${postoId} não encontrado.`);
    }

    const comments = await Comment.find({ postoId });
    const formattedComments = comments.map(comment => ({
      ...comment.toObject(),
      formattedDate: moment(comment.createdAt).format('DD/MM/YYYY HH:mm'),
    }));

    res.render('comment', {
      title: 'Adicionar Comentário',
      posto,
      comments: formattedComments,
    });
  } catch (error) {
    console.error('Erro ao carregar a página de comentários:', error);
    res.render('comment', {
      title: 'Adicionar Comentário',
      posto: { name: 'Posto Desconhecido' },
      comments: [],
      errorMessage: 'Erro ao carregar a página. Tente novamente mais tarde.',
    });
  }
});

// Rota para adicionar comentário
router.post('/:postoId/add-comment', async (req, res) => {
  const { name, cpf, comment } = req.body;
  const { postoId } = req.params;

  const user = req.session.user;

  if (!user && (!name || !cpf || !comment)) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const sanitizedCPF = cpf ? cpf.replace(/[^\d]/g, '') : null;

  if (!user && !isValidCPF(sanitizedCPF)) {
    return res.status(400).send('CPF inválido. Por favor, insira um CPF válido.');
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(postoId)) {
      throw new Error(`ID do Posto inválido: ${postoId}`);
    }

    const newComment = new Comment({
      name: user ? user.username : name,
      cpf: user ? user.email : sanitizedCPF,
      comment,
      postoId,
      isAdmin: !!user
    });

    await newComment.save();
    res.redirect(`/estoque/${postoId}`);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).send('Erro ao adicionar comentário.');
  }
});

function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;

  return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
}

module.exports = router;
