/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

export const before = (request) => {
	request.options.headers["Accept"]       = "application/json";
	request.options.headers["Content-Type"] = "application/json; charset=utf-8";

	if (typeof request.options.body === "object") {
		request.options.body = JSON.stringify(request.options.body);
	}
};

export const after = (response) => {
	return new Promise((resolve) => {
	    response.json().then((body) => {
	    	Object.defineProperty(response, "body", {
	      		get: () => body
	    	});
		
			resolve(response);
	    });	
	});
};

module.exports = () => (request) => {
	before(request);
	return after;
};

module.exports.handler = () => after;
