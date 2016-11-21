/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import queryString from "query-string";
import {compute, computeObject} from "utils/compute";

const _trimSlashes = (string, preserveTrailingSlash) => {
	const pattern = preserveTrailingSlash ? /(^\/+)/g : /(^\/+|\/+$)/g;
	return string.toString().replace(pattern, "");
};

const createClient = (url, options = {}, middlewares = []) => {
	const endpoint = {
		url,
		options,
		middlewares: {}
	};

	endpoint.request = request.bind(null, endpoint);
	endpoint.get     = get.bind(null, endpoint);
	endpoint.post    = post.bind(null, endpoint);
	endpoint.patch   = patch.bind(null, endpoint);
	endpoint.put     = put.bind(null, endpoint);
	endpoint.del     = del.bind(null, endpoint);
	endpoint.browse  = browse.bind(null, endpoint);
	endpoint.read    = read.bind(null, endpoint);
	endpoint.edit    = edit.bind(null, endpoint);
	endpoint.replace = replace.bind(null, endpoint);
	endpoint.add     = add.bind(null, endpoint);
	endpoint.destroy = destroy.bind(null, endpoint);
	endpoint.list    = endpoint.browse;
	endpoint.update  = endpoint.edit;
	endpoint.create  = endpoint.add;

	endpoint.addMiddleware    = addMiddleware.bind(null, endpoint);
	endpoint.removeMiddleware = removeMiddleware.bind(null, endpoint);

	if (middlewares.length) {
		middlewares.forEach(endpoint.addMiddleware);
	}

	endpoint.options.preserveTrailingSlash = options.preserveTrailingSlash === undefined ? false : options.preserveTrailingSlash;
	return endpoint;
};

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

const _callFetch = (endpoint, path = "", options = {}, middlewares = []) => {
	let afterMiddlewares = [];
	let errorMiddlewares = [];
	let fetchFunc;

	return new Promise((resolve, reject) => {
		const url = _trimSlashes(compute(endpoint.url));

		path = compute(path);

		if (!(path instanceof Array)) {
			path = [path];
		}

		path = _trimSlashes(path.map(compute).map(encodeURI).join("/"), endpoint.options.preserveTrailingSlash);

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
			query = "?" + queryString.stringify(computeObject(query));
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

		let recovered = null;

		errorMiddlewares.some((errorMiddleware) => {
			try {
				return recovered = errorMiddleware(error);
			}
			catch (e) {
				error = e;
			}
		});

		if (recovered) {
			return recovered;
		}

		throw error;
	});
};

const _expectEven = (array) => {
	array = compute(array);

	if (array instanceof Array && array.length % 2 !== 0) {
		throw new RangeError("Expected even array");
	}

	return array;
}

const _expectOdd = (array) => {
	array = compute(array);

	if (array instanceof Array && array.length % 2 !== 1) {
		throw new RangeError("Expected odd array");
	}

	return array;
}

function request (_endpoint, path, options = {}, middlewares = []) {
	return _callFetch(_endpoint, path, {action: "request", ...options}, middlewares);
}

function get (_endpoint, path, options = {}, middlewares = []) {
	return request(_endpoint, path, {action: "get", method: "GET", ...options}, middlewares);
}

function post (_endpoint, path, options = {}, middlewares = []) {
	return request(_endpoint, path, {action: "post", method: "POST", ...options}, middlewares);
}

function patch (_endpoint, path, options = {}, middlewares = []) {
	return request(_endpoint, path, {action: "patch", method: "PATCH", ...options}, middlewares);
}

function put (_endpoint, path, options = {}, middlewares = []) {
	return request(_endpoint, path, {action: "put", method: "PUT", ...options}, middlewares);
}

function del (_endpoint, path, options = {}, middlewares = []) {
	return request(_endpoint, path, {action: "del", method: "DELETE", ...options}, middlewares);
}

function browse (_endpoint, path, options = {}, middlewares = []) {
	return get(_endpoint, () => _expectOdd(path), {action: "browse", ...options}, middlewares);
}

function read (_endpoint, path, options = {}, middlewares = []) {
	return get(_endpoint, () => _expectEven(path), {action: "read", ...options}, middlewares);
}

function edit (_endpoint, path, options = {}, middlewares = []) {
	return patch(_endpoint, () => _expectEven(path), {action: "edit", ...options}, middlewares);
}

function replace (_endpoint, path, options = {}, middlewares = []) {
	return put(_endpoint, () => _expectEven(path), {action: "replace", ...options}, middlewares);
}

function add (_endpoint, path, options = {}, middlewares = []) {
	return post(_endpoint, () => _expectOdd(path), {action: "add", ...options}, middlewares);
}

function destroy (_endpoint, path, options = {}, middlewares = []) {
	return del(_endpoint, () => _expectEven(path), {action: "destroy", ...options}, middlewares);
}

const _dropInFetch = (url, options = {}, middlewares = []) => {
	return _callFetch({
		url,
		options,
		middlewares: {}
	}, "", {}, middlewares);
};

module.exports = {
	// Fetch+ API:
	createClient,
	connectEndpoint: createClient, // deprecated
	addMiddleware,
	removeMiddleware,
	// Drop-in replacement:
	fetch: _dropInFetch,
	// Generic:
	request,
	get,
	post,
	patch,
	put,
	del,
	// BREAD:
	browse,
	read,
	edit,
	add,
	destroy,
	// CRUD:
	list: browse,
	update: edit,
	create: add,
	// Utilities:
	compute,
	computeObject
};
