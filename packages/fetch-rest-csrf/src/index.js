/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute} from "utils/compute";

// Export using middleware direct notation.
module.exports = (headerName, currentValue) => (request) => {
	if (currentValue) {
		request.options.headers[headerName] = compute(currentValue);
	}

	return (response) => {
		if (response.headers && response.headers.has && response.headers.has(headerName)) {
			currentValue = response.headers.get(headerName);
		}

		return response;
	};
};
