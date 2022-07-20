const config = require('config');
const axios = require('axios');

// class LACityService which is a wrapper to call LACity Apis and services
class LACityService {
	/*
	Wrapper function to get Visitors data from LACity server API
	@param express response containing array of visitors data
	*/
	static async getVisitorsData() {
		return new Promise((resolve, reject) => {
			const request = {
				method: "GET",
				url: `${config.get("LACityApiUrl")}/resource/trxm-jn3c.json`,
			}
			axios(request)
			.then((response) => {
				if(response.status == 200) {
					return resolve(response.data);
				}
				return new Error(response)
			}).catch((error) => {
				reject(error.toJSON());
			})
		})
	}
 }

module.exports = {
	LACityService
}
