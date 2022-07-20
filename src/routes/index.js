const museuemVisitor = require('./getMuseumVisitors');

// This function will append all the routes of the app on express app object
module.exports.registerRoutes = (app) => {
	app.use(museuemVisitor);
}  