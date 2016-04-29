/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {computeObject} from "utils/compute";

const _serialize = (userAgents) => {
	if (typeof userAgents !== "object") {
		return userAgents;
	}

	return Object.keys(userAgents).map((key) => {
		return [key, userAgents[key]].join("/").replace(/[\t\r\n\s]+/g, "-");
	}).join(" ");
};

module.exports = (userAgents) => {
	userAgents = _serialize(userAgents);

	return (request) => {
		const userAgent = _serialize(computeObject(userAgents));

		request.options.headers["User-Agent"] = userAgent;
	};
};
