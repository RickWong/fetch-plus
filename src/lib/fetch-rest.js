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

function _get (value) {
	return typeof value === "function" ? value() : value;
}

function _objectGet (object) {
	let mapped = {};

	if (typeof object[Symbol.iterator] !== "function") {
		return object;
	}

	for (let [key, value] of object) {
		mapped[key] = typeof value === "object" ? _objectGet(value) : _get(value);
	}

	return mapped;
}

function createEndpoint (url, options = {}) {
	const endpoint = {
		url,
		options
	};

	endpoint.browse  = browse.bind(null, endpoint);
	endpoint.read    = read.bind(null, endpoint);
	endpoint.edit    = edit.bind(null, endpoint);
	endpoint.replace = replace.bind(null, endpoint);
	endpoint.add     = add.bind(null, endpoint);
	endpoint.destroy = destroy.bind(null, endpoint);

	return endpoint;
}

function _callFetch (endpoint, path, query, options) {
	let combinedOptions;

	return new Promise((resolve, reject) => {
		const url = _trimSlashes(_get(endpoint.url)) + "/";

		path = _get(path);

		if (!(path instanceof Array)) {
			path = [path];
		}

		path = path.map(_get).map(_trimSlashes).map(encodeURI).join("/");

		if (typeof query === "object") {
			query = "?" + encodeURI(queryString.stringify(_objectGet(query)));
		}
		else {
			query = "";
		}

		combinedOptions = {
			..._objectGet(endpoint.options),
			..._objectGet(options)
		};

		resolve({url, path, query, combinedOptions});
	}).then(({url, path, query, combinedOptions}) => {
		return fetch(url + path + query, combinedOptions);
	}).then((response) => {
		if (!response.ok) {
			throw ReferenceError(response.status + " " + response.statusText);
		}

		return _get(combinedOptions.json) ? response.json() : response;
	});
}

function _expectEven (array) {
	array = _get(array);

	if (array instanceof Array && array.length % 2 !== 0) {
		throw new RangeError("Expected even array");
	}

	return array;
}

function _expectOdd (array) {
	array = _get(array);

	if (array instanceof Array && array.length % 2 !== 1) {
		throw new RangeError("Expected odd array");
	}

	return array;
}

function browse (_endpoint, path, query = {}, options = {}) {
	return _callFetch(_endpoint, () => _expectOdd(path), query, {method: "GET", ...options});
}

function read (_endpoint, path, query = {}, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), query, {method: "GET", ...options});
}

function edit (_endpoint, path, query = {}, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), query, {method: "PATCH", ...options});
}

function replace (_endpoint, path, query = {}, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), query, {method: "PUT", ...options});
}

function add (_endpoint, path, query = {}, options = {}) {
	return _callFetch(_endpoint, () => _expectOdd(path), query, {method: "POST", ...options});
}

function destroy (_endpoint, path, query = {}, options = {}) {
	return _callFetch(_endpoint, () => _expectEven(path), query, {method: "DELETE", ...options});
}

module.exports = {
	createEndpoint,
	browse,
	read,
	edit,
	add,
	destroy
};
