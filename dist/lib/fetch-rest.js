(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fetchRest"] = factory();
	else
		root["fetchRest"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
	                                                                                                                                                                                                                                                                   * @copyright © 2015, Rick Wong. All rights reserved.
	                                                                                                                                                                                                                                                                   */

	var _queryString = __webpack_require__(1);

	var _queryString2 = _interopRequireDefault(_queryString);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if (typeof fetch !== "function") {
		throw new TypeError("Fetch API required but not available");
	}

	function cleanSlashes(s) {
		return s.toString().replace(/(^\/+|\/+$)/g, "");
	}

	function describeEndpoint(url, options) {
		var endpoint = {
			url: url,
			options: options
		};

		endpoint.describeResource = describeResource.bind(null, endpoint);

		return endpoint;
	}

	function describeResource(_endpoint, path, options) {
		var resource = {
			path: path,
			url: cleanSlashes(_endpoint.url) + "/" + cleanSlashes(path),
			options: _extends({}, _endpoint.options, options),
			endpoint: _endpoint
		};

		resource.browse = browse.bind(null, resource);
		resource.read = read.bind(null, resource);
		resource.edit = edit.bind(null, resource);
		resource.replace = replace.bind(null, resource);
		resource.add = add.bind(null, resource);
		resource.destroy = destroy.bind(null, resource);

		return resource;
	}

	function browse(_resource, query, options) {
		return fetch(_resource.url + "?" + _queryString2.default.stringify(query), _extends({}, _resource.options, options));
	}

	function read(_resource, id, query, options) {
		return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + _queryString2.default.stringify(query), _extends({}, _resource.options, options));
	}

	function edit(_resource, id, query, options) {
		return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + _queryString2.default.stringify(query), _extends({}, _resource.options, {
			method: "PATCH"
		}, options));
	}

	function replace(_resource, id, query, options) {
		return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + _queryString2.default.stringify(query), _extends({}, _resource.options, {
			method: "PUT"
		}, options));
	}

	function add(_resource, query, options) {
		return fetch(_resource.url + "?" + _queryString2.default.stringify(query), _extends({}, _resource.options, {
			method: "POST"
		}, options));
	}

	function destroy(_resource, id, query, options) {
		return fetch(_resource.url + "/" + encodeURI(cleanSlashes(id)) + "?" + _queryString2.default.stringify(query), _extends({}, _resource.options, {
			method: "DELETE"
		}, options));
	}

	module.exports = {
		describeEndpoint: describeEndpoint,
		describeResource: describeResource,
		browse: browse,
		read: read,
		edit: edit,
		add: add,
		destroy: destroy
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(2);

	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};

	exports.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return {};
		}

		return str.split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	exports.stringify = function (obj) {
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];

			if (val === undefined) {
				return '';
			}

			if (val === null) {
				return key;
			}

			if (Array.isArray(val)) {
				return val.sort().map(function (val2) {
					return strictUriEncode(key) + '=' + strictUriEncode(val2);
				}).join('&');
			}

			return strictUriEncode(key) + '=' + strictUriEncode(val);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	};


/***/ }
/******/ ])
});
;