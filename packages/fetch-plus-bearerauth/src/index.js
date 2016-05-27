/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute} from "utils/compute";

// Export using middleware creation notation.
module.exports = (token) => (request) => {
	const computedToken = compute(token);
	if (computedToken === undefined || computedToken === null) {
		return;
	}

	request.options.headers["Authorization"] = "Bearer " + computedToken;
};
