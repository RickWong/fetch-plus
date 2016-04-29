/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

const after = (options = {}) => (response) => {
	const resolveWith = (value) => {
		if (!options.fullResponse) {
			return value;
		}

		// When requested to return the full response, overwrite
		// the body property
		Object.defineProperty(response, "body", {
			get: () => value
		});

		return response;
	};

	let json = response.json();

	// The return value of json() is not always Promise (?)
	// Issue: https://github.com/bitinn/node-fetch/issues/111
	if (typeof json !== "object" || typeof json.then !== "function") {
		json = Promise.resolve(json);
	}

	return json.then(resolveWith).catch((error) => {
		// JSON parse failed
		// If status is 204, assume there was no data
		if (response.status === 204) {
			return resolveWith(null);
		}

		throw error;
	});
};

module.exports = (options = {}) => (request) => {
	request.options.headers["Accept"]       = "application/json";
	request.options.headers["Content-Type"] = "application/json; charset=utf-8";

	if (typeof request.options.body === "object") {
		request.options.body = JSON.stringify(request.options.body);
	}

	return after(options);
};

module.exports.handler = (options = {}) => after(options);
