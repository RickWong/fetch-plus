/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import queryString from "query-string";

if (typeof fetch !== "function") {
	throw new TypeError("Fetch API required but not available");
}

function _trimSlashes (string) {
	return string.toString().replace(/(^\/+|\/+$)/g, "");
}

function _compute (value) {
	return typeof value === "function" ? value() : value;
}

function _computeObject (object) {
	let mapped = {};

	Object.keys(object).forEach((key) => {
		const value = object[key];

		mapped[key] = typeof value === "object" ? _computeObject(value) : _compute(value);
	});

	return mapped;
}

function connectEndpoint (url, options = {}, middlewares = []) {
	const endpoint = {
		url,
		options,
		middlewares: {}
	};

	endpoint.browse  = browse.bind(null, endpoint);
	endpoint.read    = read.bind(null, endpoint);
	endpoint.edit    = edit.bind(null, endpoint);
	endpoint.replace = replace.bind(null, endpoint);
	endpoint.add     = add.bind(null, endpoint);
	endpoint.destroy = destroy.bind(null, endpoint);

	endpoint.addMiddleware    = addMiddleware.bind(null, endpoint);
	endpoint.removeMiddleware = removeMiddleware.bind(null, endpoint);

	if (middlewares.length) {
		middlewares.forEach(endpoint.addMiddleware);
	}

	return endpoint;
}

let middlewareId = 23000;

function addMiddleware (_endpoint, middleware) {
	if (!middleware._middlewareId) {
		middleware._middlewareId = middlewareId++;
	}

	_endpoint.middlewares[middleware._middlewareId] = middleware;

	return _endpoint;
}

function removeMiddleware (_endpoint, middleware) {
	if (!middleware._middlewareId) {
		return;
	}

	if (_endpoint.middlewares[middleware._middlewareId]) {
		delete _endpoint.middlewares[middleware._middlewareId];
	}

	return _endpoint;
}

function _callFetch (endpoint, path, options) {
	let afterMiddlewares = [];

	return new Promise((resolve, reject) => {
		const url = _trimSlashes(_compute(endpoint.url)) + "/";

		path = _compute(path);

		if (!(path instanceof Array)) {
			path = [path];
		}

		path = path.map(_compute).map(_trimSlashes).map(encodeURI).join("/");

		options = {
			headers: {},
			..._computeObject(endpoint.options),
			..._computeObject(options)
		};

		resolve({url, path, options});
	}).then((request) => {
		Object.keys(endpoint.middlewares).forEach((key) => {
			const before = endpoint.middlewares[key];
			const after = before(request);

			if (typeof after === "function") {
				afterMiddlewares.push(after);
			}
		});

		let query = request.options.query;

		if (typeof query === "object") {
			query = "?" + encodeURI(queryString.stringify(_computeObject(query)));
		}
		else {
			query = "";
		}

		return fetch(request.url + request.path + query, request.options);
	}).then((response) => {
		if (!response.ok) {
			throw response;
		}

		if (!afterMiddlewares.length) {
			return response;
		}

		let promise = Promise.resolve(response).catch((error) => {throw error;});

		afterMiddlewares.forEach((after) => {
			promise = promise.then(after);
		});

		return promise;
	});
}

function _expectEven (array) {
	array = _compute(array);

	if (array instanceof Array && array.length % 2 !== 0) {
		throw new RangeError("Expected even array");
	}

	return array;
}

function _expectOdd (array) {
	array = _compute(array);

	if (array instanceof Array && array.length % 2 !== 1) {
		throw new RangeError("Expected odd array");
	}

	return array;
}

function browse (_endpoint, path, options = {}) {
	return _callFetch(_endpoint, () => _expectOdd(path), {action: "browse", method: "GET", ...options});
}

function read (_endpoint, path, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "read", method: "GET", ...options});
}

function edit (_endpoint, path, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "edit", method: "PATCH", ...options});
}

function replace (_endpoint, path, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "replace", method: "PUT", ...options});
}

function add (_endpoint, path, options = {}) {
	return _callFetch(_endpoint, () => _expectOdd(path), {action: "add", method: "POST", ...options});
}

function destroy (_endpoint, path, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "destroy", method: "DELETE", ...options});
}

module.exports = {
	connectEndpoint,
	addMiddleware,
	removeMiddleware,
	browse,
	read,
	edit,
	add,
	destroy
};
