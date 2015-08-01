//  El controlador importa el modelo para poder acceder a DB
var models = require('../models/models.js');

var users = {
	admin: {id:1,username:"admin", password:"1234"},
    pepe:  {id:2,username:"pepe",  password:"5678"}
}
// Comprueba si el usuario esta registrado en users
// Si autenticacion falla o hay errores se ejecuta el callback (error). 
exports.autenticar = function(login,password,callback){
	console.log(users);
	if (users[login]){
		if (password === users[login].password){
			callback(null,users[login]);
		}else{
			callback(new Error('Password erroneo.'));
		}
	}else{
		callback(new Error('No existe el usuario'));
	}
}