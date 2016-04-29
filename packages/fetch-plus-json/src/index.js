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

export const after = (options = {}) => (response) => {
	return new Promise((resolve, reject) => {
		// When requested to return the full response, overwrite
		// the body property
		const resolveWith = (value) => {
			if (options.fullResponse) {
				Object.defineProperty(response, "body", {
					get: () => value
				});

				resolve(response);
			} else {
				resolve(value);
			}
		};

		response.json().then(resolveWith).catch((err) => {
			// JSON parse failed
			// If status is 204, assume there was no data
			if (response.status === 204) {
				resolveWith(null);
			} else {
				reject(err);
			}
		});
	});
};

module.exports = (options = {}) => (request) => {
	before(request);
	return after(options);
};

module.exports.handler = (options = {}) => after(options);
