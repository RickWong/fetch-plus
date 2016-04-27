/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute} from "utils/compute";

// Export using middleware creation notation.
module.exports = (username, password, _btoa = null) => (request) => {

	if (!_btoa) {
		if (typeof btoa === "undefined") {
			throw new TypeError("btoa() function required but not available");
		}

		_btoa = btoa;
	}

	request.options.headers["Authorization"] = "Basic " + _btoa(compute(username) + ":" + compute(password));
};
