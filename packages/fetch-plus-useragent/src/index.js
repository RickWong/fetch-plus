/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {computeObject} from "utils/compute";

// Export using middleware creation notation.
module.exports = (userAgents) => (request) => {
	let userAgent = computeObject(userAgents);

	if (typeof userAgent !== "string") {
		userAgent = Object.keys(userAgent).map((key) => {
			return [key, userAgent[key]].join("/").replace(/[\t\r\n\s]+/g, "-");
		}).join(" ");
	}

	request.options.headers["User-Agent"] = userAgent;
};
