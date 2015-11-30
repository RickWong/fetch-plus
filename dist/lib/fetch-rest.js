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

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _queryString = __webpack_require__(5);

	var _queryString2 = _interopRequireDefault(_queryString);

	var _jsonMiddleware = __webpack_require__(3);

	var _jsonMiddleware2 = _interopRequireDefault(_jsonMiddleware);

	var _useragentMiddleware = __webpack_require__(4);

	var _useragentMiddleware2 = _interopRequireDefault(_useragentMiddleware);

	var _basicauthMiddleware = __webpack_require__(2);

	var _basicauthMiddleware2 = _interopRequireDefault(_basicauthMiddleware);

	var _authMiddleware = __webpack_require__(1);

	var _authMiddleware2 = _interopRequireDefault(_authMiddleware);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; } /**
	                                                                                                                              * @copyright © 2015, Rick Wong. All rights reserved.
	                                                                                                                              */

	if (typeof fetch !== "function") {
		throw new TypeError("Fetch API required but not available");
	}

	function _trimSlashes(string) {
		return string.toString().replace(/(^\/+|\/+$)/g, "");
	}

	function _compute(value) {
		return typeof value === "function" ? value() : value;
	}

	function _computeObject(object) {
		var mapped = {};

		Object.keys(object).forEach(function (key) {
			var value = object[key];

			mapped[key] = (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" ? _computeObject(value) : _compute(value);
		});

		return mapped;
	}

	function connectEndpoint(url) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		var middlewares = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

		var endpoint = {
			url: url,
			options: options,
			middlewares: {}
		};

		endpoint.browse = browse.bind(null, endpoint);
		endpoint.read = read.bind(null, endpoint);
		endpoint.edit = edit.bind(null, endpoint);
		endpoint.replace = replace.bind(null, endpoint);
		endpoint.add = add.bind(null, endpoint);
		endpoint.destroy = destroy.bind(null, endpoint);

		endpoint.addMiddleware = addMiddleware.bind(null, endpoint);
		endpoint.removeMiddleware = removeMiddleware.bind(null, endpoint);

		if (middlewares.length) {
			middlewares.forEach(endpoint.addMiddleware);
		}

		return endpoint;
	}

	var middlewareId = 23000;

	function addMiddleware(_endpoint, middleware) {
		if (!middleware._middlewareId) {
			middleware._middlewareId = middlewareId++;
		}

		_endpoint.middlewares[middleware._middlewareId] = middleware;
	}

	function removeMiddleware(_endpoint, middleware) {
		if (!middleware._middlewareId) {
			return;
		}

		if (_endpoint.middlewares[middleware._middlewareId]) {
			delete _endpoint.middlewares[middleware._middlewareId];
		}
	}

	function _callFetch(endpoint, path, query, options) {
		var afterMiddlewares = [];

		return new Promise(function (resolve, reject) {
			var url = _trimSlashes(_compute(endpoint.url)) + "/";

			path = _compute(path);

			if (!(path instanceof Array)) {
				path = [path];
			}

			path = path.map(_compute).map(_trimSlashes).map(encodeURI).join("/");

			if ((typeof query === "undefined" ? "undefined" : _typeof(query)) === "object") {
				query = "?" + encodeURI(_queryString2.default.stringify(_computeObject(query)));
			} else {
				query = "";
			}

			options = _extends({
				headers: {}
			}, _computeObject(endpoint.options), _computeObject(options));

			resolve({ url: url, path: path, query: query, options: options });
		}).then(function (request) {

			Object.keys(endpoint.middlewares).forEach(function (key) {
				var before = endpoint.middlewares[key];
				var after = before(request);

				if (typeof after === "function") {
					afterMiddlewares.push(after);
				}
			});

			return fetch(request.url + request.path + request.query, request.options);
		}).then(function (response) {
			if (!response.ok) {
				throw response;
			}

			if (!afterMiddlewares.length) {
				return response;
			}

			var promise = Promise.resolve(response).catch(function (error) {
				throw error;
			});

			afterMiddlewares.forEach(function (after) {
				promise = promise.then(after);
			});

			return promise;
		});
	}

	function _expectEven(array) {
		array = _compute(array);

		if (array instanceof Array && array.length % 2 !== 0) {
			throw new RangeError("Expected even array");
		}

		return array;
	}

	function _expectOdd(array) {
		array = _compute(array);

		if (array instanceof Array && array.length % 2 !== 1) {
			throw new RangeError("Expected odd array");
		}

		return array;
	}

	function browse(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectOdd(path);
		}, query, _extends({ action: "browse", method: "GET" }, options));
	}

	function read(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ action: "read", method: "GET" }, options));
	}

	function edit(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ action: "edit", method: "PATCH" }, options));
	}

	function replace(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ action: "replace", method: "PUT" }, options));
	}

	function add(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectOdd(path);
		}, query, _extends({ action: "add", method: "POST" }, options));
	}

	function destroy(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ action: "destroy", method: "DELETE" }, options));
	}

	module.exports = {
		connectEndpoint: connectEndpoint,
		addMiddleware: addMiddleware,
		removeMiddleware: removeMiddleware,
		browse: browse,
		read: read,
		edit: edit,
		add: add,
		destroy: destroy,
		jsonMiddleware: _jsonMiddleware2.default,
		useragentMiddleware: _useragentMiddleware2.default,
		basicauthMiddleware: _basicauthMiddleware2.default,
		authMiddleware: _authMiddleware2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @copyright © 2015, Rick Wong. All rights reserved.
	 */

	// Export using middleware notation.

	exports.default = function (token) {
	  return function (request) {
	    request.options.headers["Authorization"] = "Bearer " + token;
	  };
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * @copyright © 2015, Rick Wong. All rights reserved.
	 */

	// Export using middleware notation.

	exports.default = function (username, password) {
		var _btoa = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

		return function (request) {
			if (typeof btoa === "undefined" && !_btoa) {
				throw new TypeError("btoa() function required but not available");
			}

			request.options.headers["Authorization"] = "Basic " + btoa(username + ":" + password);
		};
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * @copyright © 2015, Rick Wong. All rights reserved.
	 */

	var before = exports.before = function before(request) {
		request.options.headers["Accept"] = "application/json";
		request.options.headers["Content-Type"] = "application/json; charset=utf-8";
	};

	var after = exports.after = function after(response) {
		return response.json();
	};

	// Export using middleware notation.

	exports.default = function (request) {
		before(request);
		return after;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	/**
	 * @copyright © 2015, Rick Wong. All rights reserved.
	 */

	// Export using middleware notation.

	exports.default = function (userAgents) {
		return function (request) {
			if (typeof userAgents !== "string") {
				userAgents = Object.keys(userAgents).map(function (key) {
					return [key, userAgents[key]].join("/").replace(/[\t\r\n\s]+/g, "-");
				}).join(" ");
			}

			request.options.headers["User-Agent"] = userAgents;
		};
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(6);

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
/* 6 */
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