/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute, computeObject} from "utils/compute";

// Export using middleware direct notation.
module.exports = (config) => (request) => {
	config = computeObject(config);

	request.options.headers["Authorization"] = "Bearer " + config.accessToken;

	return {
		error: (error) => {
			if (error.status === 403 && config.refreshToken) {
				return config.refresh();
			}

			throw error;
		}
	}
};
