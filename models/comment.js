// Definimos el modelo de Quiz

module.exports = function(sequelize,DataTypes){
	return sequelize.define(
		'Comment',
		{texto:{
			type: 		DataTypes.STRING,
			validate:  {notEmpty: {msg: "-> Falta Commentario"}}
		}
	});
}	