
const { RESPONSE_CODES } = require('./constants');

class ResponseSchema {
	/*
	This function prepare response in case of successful operation
	@params data - records received from getir Db
	*/
	static successResponse(data) {
		return {
			...data
		}
	}

	/*
	This function prepare response in case of failure operation
	@params message - failure message
	*/
	static failedResponse(failureMessage) {
		return {
			message: failureMessage
		}
	}
}

module.exports = { ResponseSchema }