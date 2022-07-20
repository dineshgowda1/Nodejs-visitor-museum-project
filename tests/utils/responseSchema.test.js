const { ResponseSchema } = require("../../src/utils/responseSchema");

describe('testing response schema objects',()=>{
	test('it should return proper result for successful response',()=>{
		const mockResponse = {
			key: "value"
		}
		expect(ResponseSchema.successResponse(mockResponse)).toEqual(mockResponse)
	})

	test('it should return proper result for failure response',()=>{
		const message = "mockMessage"
		const expectedResponse = {
			message
		}
		expect(ResponseSchema.failedResponse(message)).toEqual(expectedResponse)
	})

})