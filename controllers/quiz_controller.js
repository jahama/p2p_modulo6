//  El controlador importa el modelo para poder acceder a DB
var models = require('../models/models.js');

// GET /quizes
exports.index = function(req,res){
	console.log('-- quiz controller -- index --- ');
	models.Quiz.findAll().then(function(quizes){
		console.log('-- quiz controller -- quizes --- ',quizes);
		res.render('quizes/index.ejs',{quizes:quizes});
	})
};

// GET /quizes/:id
exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz:quiz});
	});
};


// GET /quizes/:id/answer
exports.answer = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer',{quiz:quiz, respuesta:'Correcto'});
		}else{
			res.render('quizes/answer',{quiz:quiz, respuesta:'Incorrecto'});
		}
	});
};









//GET  /quizes/question
exports.question = function(req,res){
	/*
	 Con los métodos models.Quiz.findAll() o find() buscamos los datos en la tabla Quiz y
	 los procesamos en el callback del método success(..). 
	*/
	models.Quiz.findAll().success(function(quiz){
		res.render('quizes/question',{pregunta:quiz[0].pregunta});
	})	
};

