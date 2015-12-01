# fetch-rest

Generic REST client using [Fetch API](https://github.com/whatwg/fetch) with middleware support.

[![version](https://img.shields.io/npm/v/fetch-rest.svg)](https://npmjs.org/package/fetch-rest) ![license](https://img.shields.io/npm/l/fetch-rest.svg) ![installs](https://img.shields.io/npm/dt/fetch-rest.svg)

## Features

- Simple API like standard Fetch API.
- Communicate with any ReSTful API.
- Options can be computed at run-time: `headers: () => value` 
- Middlewares can manipute request options before fetching.
- Middlewares can transform responses after fetching, like calling `json()` or parsing into ImmutableJS records.
- Runs in Node and browsers.

## Installation

```bash
npm install --save fetch-rest

# Optional middlewares
npm install --save fetch-rest-basicauth
npm install --save fetch-rest-bearerauth
npm install --save fetch-rest-json
npm install --save fetch-rest-useragent
npm install --save fetch-rest-xml
```

## Usage

````js
import {connectEndpoint} from "fetch-rest";

const jsonApi = connectEndpoint(
	"http://jsonplaceholder.typicode.com",  // API server URL
	{cache: "no-cache"},                    // Fetch API options
	middlewares                             // Middlewares array
);

// Define a custom middleware with middleware function notation:
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
		() => {postId: 12},      // Query string parameters, can be computed or static
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
