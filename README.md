# fetch-rest

Generic REST API client using [Fetch API](https://github.com/whatwg/fetch) with middleware support.

![version](https://img.shields.io/npm/v/fetch-rest.svg) ![license](https://img.shields.io/npm/l/fetch-rest.svg) ![installs](https://img.shields.io/npm/dt/fetch-rest.svg)

## Features

- Simple API like standard Fetch API.
- Communicate with any REST API.
- Options can be computed at run-time: `headers: () => value` 
- Middlewares can manipute request options before fetching.
- Middlewares can transform responses after fetching, like calling `json()` or parsing into ImmutableJS records.
- Runs in Node and browsers.

Just remember to bring your own Fetch API and ES Promise polyfills.

## Installation

```bash
npm install --save fetch-rest

# Polyfill if you haven't already:
npm install --save isomorphic-fetch es6-promise
```

## Usage

````js
import {connectEndpoint} from "fetch-rest";

const jsonApi = connectEndpoint(
	"http://jsonplaceholder.typicode.com",  // API server URL
	{cache: "no-cache"},                    // Fetch API options
	middlewares                             // Middlewares
);

// Enable more middlewares!
jsonApi.addMiddleware(
	(request) => {                             // Writable object {url, path, query, options}
		request.path += ".json";               // Transform request before fetching
		return (response) => response.json();  // Transform response after fetching
	}
);

 // Perform REST action: browse, read, edit, replace, add, or destroy
jsonApi.browse(            
	"comments",             // String or array like ["comments", id, "likes", id] etc
	{postId: 12},           // Query string parameters
	{mode: "no-cors"}       // Additional Fetch API options
).then(
	(json) => console.log(json)
).catch(
	(error) => console.warn(error)
);

// Disable middlewares. 
jsonApi.removeMiddleware(jsonMiddleware);
````

See [example.js](https://github.com/RickWong/fetch-rest/blob/master/src%2Fexample.js) for more.

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
