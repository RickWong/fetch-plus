/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import {parseString} from "xml2js";

const after = (response) => {
	return new Promise((resolve, reject) => {
		response.text().then((text) => {
			parseString(text, (error, result) => {
				error === null ? resolve(result) : reject(error);
			});
		}).catch((error) => {
			reject(error);
		});
	});
};

module.exports = () => (request) => {
	request.options.headers["Accept"]       = "application/xml";
	request.options.headers["Content-Type"] = "application/xml; charset=utf-8";

	return after;
};

module.exports.handler = () => after;
