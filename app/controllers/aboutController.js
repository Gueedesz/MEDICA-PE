// app/controllers/aboutController.js
exports.getAboutPage = (req, res) => {
    res.render('aboutus', {
        title: 'Sobre Nós'
    });
};
