const { ResponseSchema } = require('../utils/responseSchema');
const { HTTP_STATUS, RESPONSE_MESSAGES } = require('../utils/constants');
const { LACityService } = require("../services/laCityService");

const monthsArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Controller class to get highest and lowest visited museum count
class GetMuseumVisitors {

	/*
	function that calculates lowest, highest visited museum along with their visitor count. Also calculates total vistor 
	@param object containing params needed for calculating visitors count based on data pulled from LACity API URL
	@param express response object with all the required response fields containing values of visited museums(highest and lowest)
	*/
	static calculateMuseumsVisitors({ visitorsCountData, visitedYear, visitedMonth, ignoreMuseum }) {

		let highestVisitedMuseum = { };
	 	let lowestVisitedMuseum =  { };
	 	let totalMuseumVistors = 0;
	 	let ignoredMuseumVisitorsCount = -1; // if ignore museum is not available then it will return -1

		if(visitorsCountData && visitorsCountData.length > 0) {
			for(let visit = 0; visit< visitorsCountData.length; visit++) {
				let visitedData = visitorsCountData[visit];
				const currentVisitedMonth = (new Date(visitedData.month)).getMonth();
				const currentVisitedYear = (new Date(visitedData.month)).getFullYear();
				if(currentVisitedYear == visitedYear && currentVisitedMonth == visitedMonth) {
					console.log(`Matched visitor entry for ${visitedYear} and ${visitedMonth}: ${JSON.stringify(visitedData)}`)
					delete visitedData.month;
					for(let key in visitedData) {
						visitedData[key] = Number(visitedData[key])
						if(ignoreMuseum && key == ignoreMuseum) {
							ignoredMuseumVisitorsCount = visitedData[key];
							continue;
						}
						totalMuseumVistors += visitedData[key];
						if(highestVisitedMuseum.visitors == null) {
							highestVisitedMuseum.visitors = visitedData[key];
							highestVisitedMuseum.museum = key
						}
						if(lowestVisitedMuseum.visitors == null) {
							lowestVisitedMuseum.visitors = visitedData[key];
							lowestVisitedMuseum.museum = key;
						}

						if(highestVisitedMuseum.visitors < visitedData[key]) {
							highestVisitedMuseum.visitors = visitedData[key];
							highestVisitedMuseum.museum = key;
						}
						if(lowestVisitedMuseum.visitors > visitedData[key]) {
							lowestVisitedMuseum.visitors = visitedData[key];
							lowestVisitedMuseum.museum = key;
						}
					}
				}
			}
		}

		const response = {
			attendance: {
				month:monthsArray[visitedMonth],
				year: visitedYear,
				highest: highestVisitedMuseum,
				lowest: lowestVisitedMuseum
			}
		}

		if(ignoredMuseumVisitorsCount >=0 ){
			response.attendance['ignore'] = { museum: ignoreMuseum, visitors: ignoredMuseumVisitorsCount }
		}

		response.attendance.total = totalMuseumVistors;
		return response;
	}

	/*
	controller function which acts as entry point to handle visitors request and returns a response
	@param express request object
	@param express response object
	*/
	static async getVisitorsData(req,res) {
		const { date, ignore } = req.query;

	 	if(!date) {
	 		console.log(`Mandatory paramters missing date or ignore value`)
	 		return res.status(HTTP_STATUS.BAD_REQUEST).json(ResponseSchema.failedResponse(RESPONSE_MESSAGES.MANDATOR_PARAMETERS_MISSING));
	 	}

	 	const requestedDate = new Date(Number(date));
	 	const month = requestedDate.getMonth();
	 	const year = requestedDate.getFullYear();

	 	try {
	 		const visitorsCountData = await LACityService.getVisitorsData();
	 		if(!visitorsCountData || !Array.isArray(visitorsCountData)) {
	 			throw new Error(visitorsCountData)
	 		}
	 		console.log(`API response visitor : ${visitorsCountData.length} `)
	 		const response = GetMuseumVisitors.calculateMuseumsVisitors({ visitorsCountData, visitedYear: year ,visitedMonth: month, ignoreMuseum:ignore });
	 		console.log(`Visitor count response : ${JSON.stringify(response)}`);
	 		res.status(HTTP_STATUS.OK).json(ResponseSchema.successResponse(response));
	 	}catch(error) {
	 		console.log(error);
	 		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ResponseSchema.failedResponse(RESPONSE_MESSAGES.INTERNA_SERVER_ERROR));
	 	}
	}
}

module.exports = { GetMuseumVisitors };