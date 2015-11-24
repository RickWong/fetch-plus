/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import queryString from "query-string";

if (typeof fetch !== "function") {
	throw new TypeError("Fetch API required but not available");
}

function cleanSlashes (s) {
	return s.toString().replace(/(^\/+|\/+$)/g, "");
}

function describeEndpoint (url, options) {
	const endpoint = {
		url,
		options
	};

	endpoint.describeResource = describeResource.bind(null, endpoint);

	return endpoint;
}

function describeResource (_endpoint, path, options) {
	const resource = {
		path,
		url: cleanSlashes(_endpoint.url) + "/" + cleanSlashes(path),
		options: {
			..._endpoint.options,
			...options
		},
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

function browse (_resource, query, options) {
	return fetch(_resource.url + "?" + queryString.stringify(query), {
		..._resource.options,
		...options
	});
}

function read (_resource, id, query, options) {
	return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + queryString.stringify(query), {
		..._resource.options,
		...options
	});
}

function edit (_resource, id, query, options) {
	return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + queryString.stringify(query), {
		..._resource.options,
		method: "PATCH",
		...options
	});
}

function replace (_resource, id, query, options) {
	return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + queryString.stringify(query), {
		..._resource.options,
		method: "PUT",
		...options
	});
}

function add (_resource, query, options) {
	return fetch(_resource.url + "?" + queryString.stringify(query), {
		..._resource.options,
		method: "POST",
		...options
	});
}

function destroy (_resource, id, query, options) {
	return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + queryString.stringify(query), {
		..._resource.options,
		method: "DELETE",
		...options
	});
}

module.exports = {
	describeEndpoint,
	describeResource,
	browse,
	read,
	edit,
	add,
	destroy
};
