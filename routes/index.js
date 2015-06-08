var express = require('express');
//Utilizamos el generador de router para gestionar las rutas concretas
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');
/*********************************************/
/***** Definicion de las rutas de Quizes *****/
/*********************************************/
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);






/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* GET Author page. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz' });
});

// Se viene por esta ruta, renderizara la vista en la que se vera
// la pregunta con el cuadro de texto para introducir la respuesta
router.get('/quizes/question', quizController.question);
// Si viene por esta ruta, en fuuncion de la respuesta se mostrara si la respuesta ha sido correcta o no
router.get('/quizes/answer'  , quizController.answer);

module.exports = router;
