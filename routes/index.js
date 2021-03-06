var express = require('express');
//Utilizamos el generador de router para gestionar las rutas concretas
var router = express.Router();


var quizController    = require ('../controllers/quiz_controller');
var commentController = require ('../controllers/comment_controller');
var sessionController = require ('../controllers/session_controller')
/****************************************************************/
/***** Definicion de las rutas de Quizes : EL INTERFAZ REST *****/
/****************************************************************/
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors:[] });
});

/*** Autoload de comandos con :quizId ***/
/*
	quizController.load() se instala para que se ejecute antes que lo necesiten las rutas show y
	answer y solo en el caso de que path contenga :quizId, referenciando un recurso en la tabla
	Quiz de la base de datos que deba ser procesado por el controlador.

	Se instala con el método param() de express (http://expressjs.com/4x/api.html#router.param),
	para que router.param(‘quizId’, quizController.load) solo invoque quizController.load si
	existe el parámetro :quizId está en algún lugar de la cabecera HTTP (en query, body o param). 
*/
router.param('quizId', quizController.load); // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId

router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',					sessionController.loginRequired,	quizController.new);
// POST /quizes/create: añade la primitiva que introduce nuevos quizes en la DB.
router.post('/quizes/create',				sessionController.loginRequired,	quizController.create);
// 
router.get('/quizes/:quizId(\\d+)/edit',	sessionController.loginRequired,	quizController.edit);
// PUT /quizes/:quizId actualiza la DB con la pregunta corregida
router.put('/quizes/:quizId(\\d+)',			sessionController.loginRequired,	quizController.update);
// DELETE /quizes/:quizId borra de la BBDD la pregunta con el id seleccionado
router.delete('/quizes/:quizId(\\d+)',		sessionController.loginRequired,	quizController.destroy);




/* GET Author page. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz', errors:[] });
});



// Se viene por esta ruta, renderizara la vista en la que se vera
// la pregunta con el cuadro de texto para introducir la respuesta
router.get('/quizes/question', quizController.question);
// Si viene por esta ruta, en fuuncion de la respuesta se mostrara si la respuesta ha sido correcta o no
router.get('/quizes/answer'  , quizController.answer);

/****************************************************************/
/***** Definicion de las rutas de Coments : EL INTERFAZ REST ****/
/****************************************************************/

router.get ('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments'	,   commentController.create);
//router.get ('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',	sessionController.loginRequired, commentController.publish);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
            sessionController.loginRequired, commentController.publish);


/*****************************************************************/
/***** Definicion de las rutas de Session : EL INTERFAZ REST *****/
/*****************************************************************/
router.get ('/login'    , sessionController.new);     // formulario de LOGIN
router.post('/login'    , sessionController.create);  // crear session
router.get ('/logout'  , sessionController.destroy);  // destruir la session

module.exports = router;