const { GetMuseumVisitors } = require("../../src/controllers/getMuseumVisitors");
const { LACityService } = require('../../src/services/laCityService');
const { HTTP_STATUS, RESPONSE_MESSAGES } = require('../../src/utils/constants');
const { ResponseSchema } = require("../../src/utils/responseSchema");

const jsonMock = jest.fn()
const mockResponseObject = {
	status: jest.fn().mockReturnValue({ json: jsonMock })
}

describe('testing getVisitorsData controller for its working',() => {

	let getVisitorsDataMock, calculateVistedMuseumsMock;

	beforeAll(() => {
		getVisitorsDataMock = jest.spyOn(LACityService, 'getVisitorsData');
		calculateVistedMuseumsMock = jest.spyOn(GetMuseumVisitors,'calculateMuseumsVisitors');
	})

	afterAll(() => {
		jest.clearAllMocks();
	})

	describe("Positive unit test cases for testing getVisitorsData controller", () => {
		test("it shouldf return visitor count response successfully ", async() => {

			const mockRequestObject = {
				query: {
					date: 1404198000000,
					ignore: "america_tropical_interpretive_center"
				}
			}

			const getLACityServiceDummyResponse = [{
				month: "2014-07-01T00:00:00.000",
				avila_adobe: "32378",
				hellman_quon: "120",
				america_tropical_interpretive_center: 100
			}]

			const calculateVistedMuseumsDummyResponse = {
				"attendance": {
					"month": "July",
					"year": 2014,
					"highest": {
						"vistor": 32378,
						"museum": "avila_adobe"
					},
					"lowest": {
						"vistor": 120,
						"museum": "hellman_quon"
					},
					"ignore": {
						"museum": "america_tropical_interpretive_center",
						"visitor": 100
					},
					"total": 32478
				}
			}

			getVisitorsDataMock.mockResolvedValueOnce(getLACityServiceDummyResponse);
			calculateVistedMuseumsMock.mockReturnValueOnce(calculateVistedMuseumsDummyResponse);
			const mockResponseObject = {
				status: jest.fn().mockReturnValue({ json: jsonMock })
			}
			await GetMuseumVisitors.getVisitorsData(mockRequestObject, mockResponseObject);
			expect(getVisitorsDataMock).toHaveBeenCalled();
			expect(calculateVistedMuseumsMock).toHaveBeenCalledWith({ visitorsCountData :getLACityServiceDummyResponse , visitedYear: 2014, visitedMonth:6, ignoreMuseum:"america_tropical_interpretive_center" })
			expect(mockResponseObject.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
			expect(jsonMock).toHaveBeenCalledWith(ResponseSchema.successResponse(calculateVistedMuseumsDummyResponse));
		})
	})	

	describe("negative unit test cases for testing getVisitorsData controller", () => {
		test("it should throw error when mandatory parameters are missing", async() =>{
			const mockRequestObject = { query: { } } 
			const mockResponseObject = {
				status: jest.fn().mockReturnValue({ json: jsonMock })
			}
			await GetMuseumVisitors.getVisitorsData(mockRequestObject, mockResponseObject);
			expect(mockResponseObject.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
			expect(jsonMock).toHaveBeenCalledWith(ResponseSchema.failedResponse(RESPONSE_MESSAGES.MANDATOR_PARAMETERS_MISSING));
		})

		test("it should be able to handle exceptions thrown by any piece of code", async() =>{
			const mockRequestObject = {
				query: {
					date: 1404198000000,
					ignore: "america_tropical_interpretive_center"
				}
			}
			const dummyError = new Error("Test error");
			getVisitorsDataMock.mockRejectedValue(dummyError);
			const mockResponseObject = {
				status: jest.fn().mockReturnValue({ json: jsonMock })
			}
			await GetMuseumVisitors.getVisitorsData(mockRequestObject, mockResponseObject);
			expect(mockResponseObject.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR)
			expect(jsonMock).toHaveBeenCalledWith(ResponseSchema.failedResponse(RESPONSE_MESSAGES.INTERNA_SERVER_ERROR));
		})
	})	
})


describe('Testing visitors count calculation code (Actual business logic)',() => {
	it("it should calculate visitors count successfully ",() => {
		const dummyData = [{
			month: "2014-07-01T00:00:00.000",
			test1Museum: 10000,
			test2Musuem: 123,
			test3Musuem: 455,
			test4Musuem: 30,
			testIgnoreMuseum: 8
		},{
			month: "2014-08-01T00:00:00.000",
			test1Museum: 10000,
			test2Musuem: 123,
			test3Musuem: 455,
			test4Musuem: 30,
			testIgnoreMuseum: 8
		}
		]

		const dummyFunctionParams = {
		   visitorsCountData : dummyData, visitedYear: 2014, visitedMonth: 6, ignoreMuseum: "testIgnoreMuseum" 
		}
		const dummyLowestVisitedMuseumtoBeMatched = { visitors: 30, museum: 'test4Musuem' };
		const dummyHighestVisitedMuseumtoBeMatched = { visitors: 10000, museum: 'test1Museum' };
		const dummyIgnoredMuseumtoBeMatched = { visitors: 8, museum: 'testIgnoreMuseum' };
		const response = GetMuseumVisitors.calculateMuseumsVisitors(dummyFunctionParams);
		console.log(response);
		expect(response).toBeDefined();
		expect(response.attendance).toBeDefined();
		expect(response.attendance.month).toEqual("July");
		expect(response.attendance.year).toEqual(2014);
		expect(response.attendance.lowest).toEqual(dummyLowestVisitedMuseumtoBeMatched);
		expect(response.attendance.ignore).toEqual(dummyIgnoredMuseumtoBeMatched);
		expect(response.attendance.total).toEqual(10608);
	})
})


