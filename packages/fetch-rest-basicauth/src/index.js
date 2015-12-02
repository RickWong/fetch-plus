/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute} from "utils/compute";

// Export using middleware creation notation.
module.exports = (username, password, _btoa = null) => (request) => {
	if (typeof btoa === "undefined" && !_btoa) {
		throw new TypeError("btoa() function required but not available");
	}

	request.options.headers["Authorization"] = "Basic " + btoa(compute(username) + ":" + compute(password));
};
