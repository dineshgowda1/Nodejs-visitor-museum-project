const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();
const { registerRoutes } = require('./routes/')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}));
const config = require('config');
registerRoutes(app);
let server ;


//starterr/driver codee
async function startServer() {
	try  {
		server = await app.listen(process.env.PORT || config.get("serverPort"));
		console.log(`Server started listening on PORT - ${config.get("serverPort")}`)
	}catch(error) {		
		console.log(error);
		return Promise.reject(error);
	}
}

// function to stop the server
async function stopServer() {
	await server.close()
}

module.exports = {
	startServer,
	stopServer
}
