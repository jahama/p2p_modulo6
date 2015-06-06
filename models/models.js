var path= require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
						{dialect:"sqlite", storage: "quiz.sqlite"}
					);
console.log(sequelize);
// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
// exportar definicion de la tabla Quiz
exports.Quiz = Quiz;

// sequilize.sync() crea e inicializa la tabla de preguntas en DB
/*
El método sequelize.sync() crea automáticamente el fichero quiz.sqlite con
la DB y sus datos iniciales, si la DB no existe. Si existe sincroniza con nuevas
definiciones del modelo, siempre que sean compatibles con anteriores.
*/
sequelize.sync().success(function(){
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count){
		if(count===0){ // la tabla se inicializa solo si esta vacia
			Quiz.create({
							pregunta :'Capital de Roma',
							respuesta:'Roma'
						})
			.success(function(){console.log('Base de datos inicializada')});
		};
	});
});