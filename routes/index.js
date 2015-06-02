var express = require('express');
//Utilizamos el generador de router para gestionar las rutas concretas
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

module.exports = router;
