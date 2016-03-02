# Fetch+

A convenient [Fetch API](https://github.com/whatwg/fetch) library with first-class middleware support.

[![version](https://img.shields.io/npm/v/fetch-plus.svg)](https://npmjs.org/package/fetch-plus) ![license](https://img.shields.io/npm/l/fetch-plus.svg) [![Package Quality](http://npm.packagequality.com/shield/fetch-plus.svg?1289194656)](http://packagequality.com/#?package=fetch-plus)  ![installs](https://img.shields.io/npm/dt/fetch-plus.svg)

## Features

- Drop-in replacement for fetch().
- Simple [BREAD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) methods for consuming REST APIs.
- A "queries" object option for building safe query strings more easily. 
- All options can be computed values: `myHeaders: () => values`
- Custom middlewares to manipute requests, responses, and caught errors.
- Useful middlewares and handlers (JSON/Auth/CSRF/Immutable etc) available as separate npm packages.
- [Fetch API Streams draft](https://github.com/yutakahirano/fetch-with-streams) handler with an Observable interface.
- Runs in Node and all browsers.

## Installation

```bash
npm install --save fetch-plus  isomorphic-fetch
```

## Additional middlewares

```bash
npm install --save fetch-plus-basicauth
npm install --save fetch-plus-bearerauth
npm install --save fetch-plus-csrf
npm install --save fetch-plus-immutable
npm install --save fetch-plus-json
npm install --save fetch-plus-oauth
npm install --save fetch-plus-stream
npm install --save fetch-plus-useragent
npm install --save fetch-plus-xml
```

## Usage

**import/require**

```js
import {fetch, connectEndpoint} from "fetch-plus";
```

**fetch**

```js
fetch("http://some.api.example/v1", {
	query: {foo: "bar"},                // Query string object. So convenient. 
	body: () => "R2-D2"                 // Computed values are computed.
});
```

**connectEndpoint**

Creates a RESTful client so middlewares can be added to it.

```js
const client = connectEndpoint("http://some.api.example/v1");
```

**client.addMiddleware**

Create middlewares like: `(request) => (response) => response`

```js
client.addMiddleware(
	(request) => {
		request.path += ".json";
		request.options.headers["Content-Type"] = "application/json; charset=utf-8";
		
		return (response) => response.json();
	}
);
```

**browse, read, edit, add, destroy, replace**

```js
client.browse(            
	"posts"                    // A string...
);

client.add(
	["posts", 1, "comments"],  // ...or an array like ["posts", id, "comments"] 
	{body: "C-3PO"}            // Regular Fetch API body option.
);
```

**request**

`request` is a fetch-like API with support for middlewares and a configured endpoint.

```js
client.request("posts/25/comments", {
	method: "POST",
	body: {comment: "C-3PO"}
});

**handlers**

Handlers take configuration and return functions to pass to `.then()`.

```js
// Transform JSON with fetch-plus-json.
import plusJson from "fetch-plus-json";

fetch("http://some.api.example/v1/posts").then(plusJson.handler({some:"config"})); 
```

See [example](https://github.com/RickWong/fetch-plus/blob/master/example/src/index.js) for more.

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
