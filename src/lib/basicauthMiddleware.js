/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

// Export using middleware creation notation.
export default (username, password, _btoa = null) => (request) => {
	if (typeof btoa === "undefined" && !_btoa) {
		throw new TypeError("btoa() function required but not available");
	}

	request.options.headers["Authorization"] = "Basic " + btoa(username + ":" + password);
};
