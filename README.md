# Fetch+

Convenient [Fetch API](https://github.com/whatwg/fetch) wrapper with handlers and middleware support.

[![version](https://img.shields.io/npm/v/fetch-plus.svg)](https://npmjs.org/package/fetch-plus) ![license](https://img.shields.io/npm/l/fetch-plus.svg) [![Package Quality](http://npm.packagequality.com/shield/fetch-plus.svg)](http://packagequality.com/#?package=fetch-plus)  ![installs](https://img.shields.io/npm/dt/fetch-plus.svg)

## Features

- Drop-in replacement for Fetch API. Well, almost.
- Usable with any HTTP endpoint. Especially suited for REST JSON APIs.
- All parameters can be computed values: `myHeaders: () => values`
- Accepts a "queries" object parameter for building safe query strings. 
- Useful handlers (JSON/Auth/CSRF/Immutable etc) available as separate npm packages.
- [Fetch API Streams draft](https://github.com/yutakahirano/fetch-with-streams) handler with an Observable interface.
- Custom middlewares to manipute all requests, responses, and caught errors.
- Runs in Node and browsers.

## Installation

```bash
npm install --save fetch-plus

# Available middlewares:
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

````js
import {connectEndpoint} from "fetch-plus";

const someApi = connectEndpoint("http://some.api.example/v1");

// Easily make your own JSON middleware:
someApi.addMiddleware(
	(request) => {
		request.path += ".json";
		request.options.headers["Content-Type"] = "application/json; charset=utf-8";
		
		return (response) => response.json();  // Call json() in all responses.
	}
);

someApi.browse(            
	["comments"],                // String or Array like ["comments", id, "likes", id] etc.
	{
		query: {postId: 12},     // Query string object. So convenient.
	}  
).then(
	(json) => console.log(json)  // Receive JSON already because of the above middleware.
).catch(
	(error) => console.warn(error)
);
````

See [example](https://github.com/RickWong/fetch-plus/blob/master/packages/example/src/index.js) for more.

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
