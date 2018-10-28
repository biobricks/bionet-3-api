const userRequired = require("../modules/apiAccess").userRequired;

module.exports = function(router) {
	
	// landing page route
	router.get("/", (req, res) => {
		let jsonResponse = {
			message: "Welcome to the BioNet API."
		};
		res.json(jsonResponse);
	});

	router.get('/dashboard', userRequired, (req, res) => {
		res.status(200).json({
			message: "User successfully retrieved from the Database.",
			user: res.locals.currentUser || {}
		});
	});	

};