/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import queryString from "query-string";
import {compute, computeObject} from "utils/compute";

function _trimSlashes (string) {
	return string.toString().replace(/(^\/+|\/+$)/g, "");
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

function _callFetch (endpoint, path = "", options = {}, middlewares = []) {
	let afterMiddlewares = [];
	let errorMiddlewares = [];
	let fetchFunc;

	return new Promise((resolve, reject) => {
		const url = _trimSlashes(compute(endpoint.url));

		path = compute(path);

		if (!(path instanceof Array)) {
			path = [path];
		}

		path = _trimSlashes(path.map(compute).map(encodeURI).join("/"));

		if (path) {
			path = "/" + path;
		}

		if (typeof options.fetch === "function")
		{
			fetchFunc = options.fetch;
		}
		else if (typeof endpoint.options.fetch === "function")
		{
			fetchFunc = endpoint.options.fetch;
		}
		else if (typeof fetch === "function") {
			fetchFunc = fetch;
		}
		else {
			throw new TypeError("fetch() function not available");
		}

		options = {
			headers: {},
			...computeObject(endpoint.options),
			...computeObject(options)
		};

		resolve({url, path, options});
	}).then((request) => {
		let endpointMiddlewares = [];

		Object.keys(endpoint.middlewares).forEach((key) => {
			endpointMiddlewares.push(endpoint.middlewares[key]);
		});

		[...endpointMiddlewares, ...middlewares].forEach((before) => {
			const result = before(request);

			if (typeof result === "function") {
				afterMiddlewares.push(result);
			}
			else if (typeof result === "object") {
				const {after = null, error = null} = result;

				if (typeof after === "function") {
					afterMiddlewares.push(after);
				}
				if (typeof error === "function") {
					errorMiddlewares.push(error);
				}
			}
		});

		let query = request.options.query || "";

		if (typeof query === "object") {
			query = "?" + encodeURI(queryString.stringify(computeObject(query)));
		}
		else if (query !== "") {
			query = "?" + compute(query);
		}

		return fetchFunc(request.url + request.path + query, request.options);
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
	}).catch((error) => {
		if (!errorMiddlewares.length) {
			throw error;
		}

		const caught = errorMiddlewares.some((errorMiddleware) => {
			try {
				errorMiddleware(error);
				return true;
			}
			catch (e) {
				error = e;
			}
		});

		if (!caught) {
			throw error;
		}
	});
}

function _expectEven (array) {
	array = compute(array);

	if (array instanceof Array && array.length % 2 !== 0) {
		throw new RangeError("Expected even array");
	}

	return array;
}

function _expectOdd (array) {
	array = compute(array);

	if (array instanceof Array && array.length % 2 !== 1) {
		throw new RangeError("Expected odd array");
	}

	return array;
}

function browse (_endpoint, path, options = {}, middlewares = []) {
	return _callFetch(_endpoint, () => _expectOdd(path), {action: "browse", method: "GET", ...options}, middlewares);
}

function read (_endpoint, path, options = {}, middlewares = []) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "read", method: "GET", ...options}, middlewares);
}

function edit (_endpoint, path, options = {}, middlewares = []) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "edit", method: "PATCH", ...options}, middlewares);
}

function replace (_endpoint, path, options = {}, middlewares = []) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "replace", method: "PUT", ...options}, middlewares);
}

function add (_endpoint, path, options = {}, middlewares = []) {
	return _callFetch(_endpoint, () => _expectOdd(path), {action: "add", method: "POST", ...options}, middlewares);
}

function destroy (_endpoint, path, options = {}, middlewares = []) {
	return _callFetch(_endpoint, () => _expectEven(path), {action: "destroy", method: "DELETE", ...options}, middlewares);
}

function _dropInFetch (url, options = {}, middlewares = []) {
	return _callFetch({
		url,
		options,
		middlewares: {}
	}, "", {}, middlewares);
}

module.exports = {
	connectEndpoint,
	addMiddleware,
	removeMiddleware,
	fetch: _dropInFetch,
	browse,
	read,
	edit,
	add,
	destroy,
	compute,
	computeObject
};
