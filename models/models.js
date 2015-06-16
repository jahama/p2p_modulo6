var path= require('path');
/***** Adaptar el modelo a despliegue en Heroku *****/
// Postgress DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite    DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user 	 = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o POSTGRES
var sequelize = new Sequelize(DB_name, user, pwd,
						{
							dialect  : protocol,
							protocol : protocol,
							port     : port,
							host     : host,
							storage  : storage,  // Solo SQLite(.env)
							omitNull : true	     // Solo Postgres
						}
					);

// Importar la definicion de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz')
var Quiz = sequelize.import(quiz_path);
// exportar definicion de la tabla Quiz
exports.Quiz = Quiz;

// sequilize.sync() crea e inicializa la tabla de preguntas en DB
/*
El método sequelize.sync() crea automáticamente el fichero quiz.sqlite con
la DB y sus datos iniciales, si la DB no existe. Si existe sincroniza con nuevas
definiciones del modelo, siempre que sean compatibles con anteriores.
*/

sequelize.sync().then(function(){
	console.log(" ----- A ------------- ");		
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		console.log(" ----- B------------- ");		
		if(count===0){ // la tabla se inicializa solo si esta vacia
			Quiz.create({
							pregunta :'Capital de Italia',
							respuesta:'Roma',
							tema:'Ocio'
						});
			
			Quiz.create({
							pregunta :'Capital de Portugal',
							respuesta:'Lisboa',
							tema:'Humanidades'
						})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});