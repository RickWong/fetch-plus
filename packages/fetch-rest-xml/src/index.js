/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {parseString} from "xml2js";

export const before = (request) => {
	request.options.headers["Accept"]       = "application/xml";
	request.options.headers["Content-Type"] = "application/xml; charset=utf-8";
};

export const after = (response) => {
	return new Promise((resolve, reject) => {
		response.text().then((text) => {
			parseString(text, (error, result) => {
				error === null ? resolve(result) : reject(error);
			});
		});
	});
};

// Export using middleware direct notation.
module.exports = (request) => {
	before(request);
	return after;
};
