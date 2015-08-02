//  El controlador importa el modelo para poder acceder a DB
var models = require('../models/models.js');

// MW para controlar la expiracion de la sesion
exports.autoLogout = function(req, res, next)
{
	// Comprobamos el tiempo de autologout
    if (req.session.user)
    {
        var tmpLastTransaction = (req.session.user.transactionTime) || 0;
        var fecha = new Date();

        // Comprobamos que no hayan pasado mas de 2 minutos desde la ultima transaccion
        if (Number(fecha.getTime()) - Number(tmpLastTransaction) > 120000 && Number(tmpLastTransaction) > 0)
        {
        	// Eliminamos la sesion y continuamos
            delete req.session.user;
            next();
        }
        else {
        	// Guardamos el nuevo tiempo
        	req.session.user.transactionTime = fecha.getTime();
        	next();
        }
    }
    else
    	next();
}

/*
	Para evitar la ejecución de los middlewares de atención a las operaciones que necesitan
	autenticación, se añade a session_controller.js un nuevo middleware que solo deja continuar
	al usuario si está autenticado. Son solo le da acceso a la pantalla de login. 
*/

// Middleware de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
	if (req.session.user){
		next();
	} else {
		res.redirect('/login');
	}
}

// Get /login -- Formulario de Login
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors:errors});
};

// POST /login  -- Crear la sesion
exports.create = function(req,res){
	var login    = req.body.login;
	var password = req.body.password;
	console.log(" -- crear la sesion --");

	/***  Controlador de usuarios ***/
	// Importamos el controlador de usuarios
	var userController = require('./user_controller');

	userController.autenticar(login,password, function(error,user){
		if (error){ // Si hay error, retornamos los mensajes de error de la sesion
			req.session.errors = [{"message": ' Se ha producido un error ' + error }];
			res.redirect("/login");
      		return;
		}
		// Crear req.session.user y guardar los campos id y username
		// La sesion se define por la existencia de -->  req.session.user
		req.session.user = {id:user.id, username:user.username};

		res.redirect(req.session.redir.toString()); // redireccion a path anterior a Login
	});
};


// GET /logout  --Destruir la sesión (Debiera de ser DELETE (REST))
exports.destroy = function(req, res){
  console.log(" -- destruir la sesion --");
  delete req.session.user;
  // Redirección a path anterior a login
  res.redirect(req.session.redir.toString());
};

