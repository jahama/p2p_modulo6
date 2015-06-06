//  El controlador importa el modelo para poder acceder a DB
var models = require('../models/models.js');


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

//GET  /quizes/answer
exports.answer = function(req,res){
	models.Quiz.findAll().success(function(quiz) {
		if (req.query.respuesta === quiz[0].respuesta){
			res.render('quizes/answer',{respuesta:'Correcto'});
		}else{
			res.render('quizes/answer',{respuesta:'Incorrecto'});
		}
	})
};