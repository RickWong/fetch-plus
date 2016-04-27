/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {compute} from "utils/compute";

// Export using middleware creation notation.
module.exports = (token) => (request) => {
	if (token != null) {
	  request.options.headers["Authorization"] = "Bearer " + compute(token);
	}
};
