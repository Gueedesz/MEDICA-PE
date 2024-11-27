// app/controllers/helpController.js
exports.getHelpPage = (req, res) => {
    res.render('help', {
        title: 'Ajuda'
    });
};
