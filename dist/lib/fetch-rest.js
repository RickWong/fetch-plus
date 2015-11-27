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

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @copyright © 2015, Rick Wong. All rights reserved.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

	var _queryString = __webpack_require__(1);

	var _queryString2 = _interopRequireDefault(_queryString);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	if (typeof fetch !== "function") {
		throw new TypeError("Fetch API required but not available");
	}

	function _trimSlashes(string) {
		return string.toString().replace(/(^\/+|\/+$)/g, "");
	}

	function _get(value) {
		return typeof value === "function" ? value() : value;
	}

	function _objectGet(object) {
		var mapped = {};

		if (typeof object[Symbol.iterator] !== "function") {
			return object;
		}

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = object[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var _step$value = _slicedToArray(_step.value, 2);

				var key = _step$value[0];
				var value = _step$value[1];

				mapped[key] = (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" ? _objectGet(value) : _get(value);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return mapped;
	}

	function createEndpoint(url) {
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		var endpoint = {
			url: url,
			options: options
		};

		endpoint.browse = browse.bind(null, endpoint);
		endpoint.read = read.bind(null, endpoint);
		endpoint.edit = edit.bind(null, endpoint);
		endpoint.replace = replace.bind(null, endpoint);
		endpoint.add = add.bind(null, endpoint);
		endpoint.destroy = destroy.bind(null, endpoint);

		return endpoint;
	}

	function _callFetch(endpoint, path, query, options) {
		var combinedOptions = undefined;

		return new Promise(function (resolve, reject) {
			var url = _trimSlashes(_get(endpoint.url)) + "/";

			path = _get(path);

			if (!(path instanceof Array)) {
				path = [path];
			}

			path = path.map(_get).map(_trimSlashes).map(encodeURI).join("/");

			if ((typeof query === "undefined" ? "undefined" : _typeof(query)) === "object") {
				query = "?" + encodeURI(_queryString2.default.stringify(_objectGet(query)));
			} else {
				query = "";
			}

			combinedOptions = _extends({}, _objectGet(endpoint.options), _objectGet(options));

			resolve({ url: url, path: path, query: query, combinedOptions: combinedOptions });
		}).then(function (_ref) {
			var url = _ref.url;
			var path = _ref.path;
			var query = _ref.query;
			var combinedOptions = _ref.combinedOptions;

			return fetch(url + path + query, combinedOptions);
		}).then(function (response) {
			if (!response.ok) {
				throw ReferenceError(response.status + " " + response.statusText);
			}

			return _get(combinedOptions.json) ? response.json() : response;
		});
	}

	function _expectEven(array) {
		array = _get(array);

		if (array instanceof Array && array.length % 2 !== 0) {
			throw new RangeError("Expected even array");
		}

		return array;
	}

	function _expectOdd(array) {
		array = _get(array);

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
		}, query, _extends({ method: "GET" }, options));
	}

	function read(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ method: "GET" }, options));
	}

	function edit(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ method: "PATCH" }, options));
	}

	function replace(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ method: "PUT" }, options));
	}

	function add(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectOdd(path);
		}, query, _extends({ method: "POST" }, options));
	}

	function destroy(_endpoint, path) {
		var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		return _callFetch(_endpoint, function () {
			return _expectEven(path);
		}, query, _extends({ method: "DELETE" }, options));
	}

	module.exports = {
		createEndpoint: createEndpoint,
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