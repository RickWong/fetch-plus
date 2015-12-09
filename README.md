# fetch-rest

Generic REST client using [Fetch API](https://github.com/whatwg/fetch) with middleware support.

[![version](https://img.shields.io/npm/v/fetch-rest.svg)](https://npmjs.org/package/fetch-rest) ![license](https://img.shields.io/npm/l/fetch-rest.svg) [![Package Quality](http://npm.packagequality.com/shield/fetch-rest.svg)](http://packagequality.com/#?package=fetch-rest)  ![installs](https://img.shields.io/npm/dt/fetch-rest.svg)

## Features

- Simple API like standard Fetch API.
- Communicate with any ReSTful API.
- All options can be computed (at run-time): `headers: () => value`
- Added "queries" option for building the query string. 
- Supports Fetch API Streams draft, with an observable interface to make it nice.
- Middlewares to manipute requests before fetching.
- Middlewares to transform responses after fetching, like calling `response.json()` or parsing into ImmutableJS records.
- Runs in Node and browsers.

## Installation

```bash
npm install --save fetch-rest

# Optional middlewares
npm install --save fetch-rest-basicauth
npm install --save fetch-rest-bearerauth
npm install --save fetch-rest-csrf
npm install --save fetch-rest-immutable
npm install --save fetch-rest-json
npm install --save fetch-rest-oauth
npm install --save fetch-rest-stream
npm install --save fetch-rest-useragent
npm install --save fetch-rest-xml
```

## Usage

````js
import {connectEndpoint} from "fetch-rest";

const jsonApi = connectEndpoint(
	"http://jsonplaceholder.typicode.com",                  // API server URL
	{cache: "no-cache"},                                    // Standard Fetch API options
	[jsonMiddleware(), basicauthMiddleware("user", "pass")]   // Middlewares array
);

// Easily make your own middleware:
jsonApi.addMiddleware(
	(request) => {                             // Writable object {url, path, query, options}
		request.path += ".json";               // Transform request before fetching
		return (response) => response.json();  // Transform response after fetching
	}
);

 // Perform REST action: browse, read, edit, replace, add, or destroy
jsonApi.browse(            
	"comments",              // String or Array like ["comments", id, "likes", id] etc
	{
		query: {postId: 12},     // Query string parameters, can be computed or static
		mode: () => "no-cors"    // Additional Fetch API options, can be deeply computed or static
	}  
).then(
	(json) => console.log(json)
).catch(
	(error) => console.warn(error)
);

// Disable middlewares. 
jsonApi.removeMiddleware(jsonMiddleware);
````

See [example](https://github.com/RickWong/fetch-rest/blob/master/packages/example/src/index.js) for more.

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
