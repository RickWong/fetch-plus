/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute, computeObject} from "utils/compute";

/**
 * config should be an object with:
 *  - string accessToken
 *  - string refreshToken
 *  - function refresh()
 */
// Export using middleware direct notation.
module.exports = (config) => (request) => {
	oauth = computeObject(config);

	request.options.headers["Authorization"] = "Bearer " + oauth.accessToken;

	return {
		error: (error) => {
			if (error.status === 403 && oauth.refreshToken) {
				return oauth.refresh();
			}

			throw error;
		}
	}
};
