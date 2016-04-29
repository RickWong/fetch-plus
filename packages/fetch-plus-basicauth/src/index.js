/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute} from "utils/compute";

// Export using middleware creation notation.
module.exports = (username, password, _btoa = null) => {
	if (!_btoa) {
		if (typeof btoa === "undefined") {
			throw new TypeError("btoa() function required but not available");
		}

		_btoa = btoa;
	}

	return (request) => {
		const basicAuth = _btoa(compute(username) + ":" + compute(password));

		request.options.headers["Authorization"] = "Basic " + basicAuth;
	};
};
