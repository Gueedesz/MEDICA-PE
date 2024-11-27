const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String },
    comment: { type: String, required: true },
    postoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Posto', required: true },
    isAdmin: { type: Boolean, default: false }, // Indica se o comentário é de um administrador
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
