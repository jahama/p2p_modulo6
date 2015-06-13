//  El controlador importa el modelo para poder acceder a DB
var models = require('../models/models.js');


// Autoload - factoriza el codigo si la ruta incluye :quizId
exports.load =function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
								function(quiz){
									if(quiz){
										req.quiz = quiz;
										next();
									}else{ next(new Error('No existe quizId = ' + quizId));}
								}
							 ).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req,res){	
	// Se utiliza el buscador 
	if (typeof(req.query.search) !== "undefined") {
		models.Quiz.findAll({where: ["pregunta like ?", '%' + req.query.search + '%'], order:'pregunta ASC'}).then(
			function(quizes){						
				res.render('quizes/index.ejs',{quizes:quizes,numero_preguntas:quizes.length});
			}
		).catch(function(error) {next(error);})
	}else{ // No se utiliza el buscador --> Se muestra todas las preguntas que hay en la BBDD
		models.Quiz.findAll().then(
			function(quizes){		
				res.render('quizes/index.ejs',{quizes:quizes});
			}
		).catch(function(error) {next(error);})
	}
};

// GET /quizes/:id
exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz:req.quiz});
	});
};


// GET /quizes/:id/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';	
	if (req.query.respuesta === req.quiz.respuesta){
		 resultado='Correcto';
	}
		
	res.render('quizes/answer',{quiz:req.quiz, respuesta:resultado});
			
};



// GET /quizes/new
exports.new = function(req,res){
	/*
		El método build(..) de sequelize creo un objeto no persistente asociado a la tabla Quiz, 
		con las propiedades inicializadas. Este objeto se utiliza aquí solo para renderizar las vistas
	*/
	var quiz = models.Quiz.build(  // crea el objeto Quiz
			{pregunta:"Pregunta", respuesta:"Respuesta"}
	);
	res.render('quizes/new', {quiz:quiz});	
};

// POST /quizes/create: añade la primitiva que introduce nuevos quizes en la DB.
/*
	El controlador create de POST /quizes/create genera el objeto quiz con models.Quiz.build( req.body.quiz ),
	incializandolo con los parámetros enviados desde el formulario, que están accesibles en req.body.quiz. 
*/
exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);

	// Guarda en la BBDD los campos pregunta y respuesta de Quiz
	quiz.save({fields:["pregunta","respuesta"]}).then(function(){
		// Una primitiva HTTP POST /quizes/create no tiene vista asociada. 
		// Al acabar realiza una redirección HTTP a la lista 
		// de preguntas invocando el método res.redirect(‘/quizes’) de express
		res.redirect('/quizes'); // Redireccion HTTP (URL relativo) lista de preguntas
	})
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

