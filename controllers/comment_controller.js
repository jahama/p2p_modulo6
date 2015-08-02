//  El controlador importa el modelo para poder acceder a DB
var models = require('../models/models.js');

// Autoload - id de comentarios
exports.load =function(req, res, next, commentId){
	models.Comment.find({
		where   :{
			id: Number(commentId)
		}		
	}).then( function(comment){
			 	if(comment){
			 		req.comment = comment;
			 		next();
			 	}else{ next(new Error('No existe commentId = ' + commentId));}
			 }
			 ).catch(function(error){next(error);});
};



// GET /quizes/:quizId/comments/new
exports.new = function(req,res){
	res.render('comments/new.ejs', {quizId:req.params.quizId, errors:[]})
}

// POST /quizes/:quizId/comments
exports.create = function(req,res){

}

// POST /quizes/:quizId/comments/create: añade la primitiva que introduce nuevos quizes en la DB.
/*
	El controlador create de POST '/quizes/:quizId/comments/create' genera el objeto comment con models.Quiz.build( req.body.comment ),
	incializandolo con los parámetros enviados desde el formulario, que están accesibles en req.body.comment. 
*/
exports.create = function(req,res){
	var comment = models.Comment.build(
		{ texto  : req.body.comment.texto,
		  QuizId : req.params.quizId
		});
	
	comment
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('comments/new', {comment:comment,quizId:req.params.quizID,errors:err.errors});
			}else{
				comment // save: guarda en la BBDD el campo texto del comentario
				.save()
				.then(function(){res.redirect('/quizes/'+req.params.quizId)})  // Redireccion HTTP (URL relativo) pregunta
			}  
		}
	);
};

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){
	req.comment.publicado = true;

	req.comment.save ({fields:["publicado"]})
		.then(function(){res.redirect('/quizes/'+ req.params.quizId);})
		.catch(function(error){next(error)});
};

