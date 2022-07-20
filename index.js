const { startServer, stopServer } = require("./src/app")

startServer().then(() => {
	process.on('SIGTERM', () => stopServer());
	process.on('SIGINT', () => stopServer());
})
.catch((err)=>console.log(err))