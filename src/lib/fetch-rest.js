/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import queryString from "query-string";

if (typeof fetch !== "function") {
	throw new TypeError("Fetch API required but not available");
}

function _trimSlashes (s) {
	return s.toString().replace(/(^\/+|\/+$)/g, "");
}

function createEndpoint (url, options) {
	const endpoint = {
		url,
		options
	};

	endpoint.createResource = createResource.bind(null, endpoint);

	return endpoint;
}

function createResource (_endpoint, path, options) {
	const resource = {
		path,
		options,
		url: _trimSlashes(_endpoint.url) + "/" + _trimSlashes(path),
		endpoint: _endpoint
	};

	resource.browse  = browse.bind(null, resource);
	resource.read    = read.bind(null, resource);
	resource.edit    = edit.bind(null, resource);
	resource.replace = replace.bind(null, resource);
	resource.add     = add.bind(null, resource);
	resource.destroy = destroy.bind(null, resource);

	return resource;
}

function _callFetch (_resource, id, query, options) {
	id    = id ? "/" + encodeURI(_trimSlashes(id)) : "";
	query = query ? "?" + queryString.stringify(query) : "";

	return fetch(_resource.url + id + query, {
		..._resource.endpoint.options,
		..._resource.options,
		...options
	});
}

function browse (_resource, query, options) {
	return _callFetch(_resource, null, query, {method: "GET", ...options});
}

function read (_resource, id, query, options) {
	return _callFetch(_resource, id, query, {method: "GET", ...options});
}

function edit (_resource, id, query, options) {
	return _callFetch(_resource, id, query, {method: "PATCH", ...options});
}

function replace (_resource, id, query, options) {
	return _callFetch(_resource, id, query, {method: "PUT", ...options});
}

function add (_resource, query, options) {
	return _callFetch(_resource, null, query, {method: "POST", ...options});
}

function destroy (_resource, id, query, options) {
	return _callFetch(_resource, id, query, {method: "DELETE", ...options});
}

module.exports = {
	createEndpoint,
	createResource,
	browse,
	read,
	edit,
	add,
	destroy
};
