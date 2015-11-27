# fetch-rest

Generic REST API client using [Fetch API](https://github.com/whatwg/fetch) with middleware support.

![version](https://img.shields.io/npm/v/fetch-rest.svg) ![license](https://img.shields.io/npm/l/fetch-rest.svg) ![installs](https://img.shields.io/npm/dt/fetch-rest.svg)

## Features

- Uses the standard Fetch API.
- Generic interface to communicate with any REST API.
- All parameters and options can be functions that will be computed at run-time: `() => value` 
- Middlewares before fetching to manipute request options.
- Middlewares after fetching for transforming responses like collections into ImmutableJS records.
- Runs in Node and browsers but bring your own Fetch API and ES Promise polyfills.

## Installation

```bash
npm install --save fetch-rest
```

## Usage

````js
import {createEndpoint} from "fetch-rest";

// Start by defining an API endpoint.
const jsonApi = createEndpoint(
	"http://jsonplaceholder.typicode.com",  // API server URL
	{cache: "no-cache"},                    // Fetch API options
	middlewares                             // Middlewares
);

// Enable more middlewares!
jsonApi.addMiddleware(
	(request) => {                             // Object {url, path, query, options}
		request.path += ".json";               // Transform request before fetching
		return (response) => response.json();  // Transform response after fetching
	}
);

// Or disable middlewares. 
jsonApi.removeMiddleware(someMiddleware);

 // Perform REST action: browse, read, edit, replace, add, or destroy
jsonApi.browse(            
	"comments",             // String or array like ["comments", [...id, [..."likes", [...id]]] etc]
	{postId: 12},           // Query string parameters
	{mode: "no-cors"}       // Additional Fetch API options
).then(
	(json) => console.log(json)
).catch(
	(error) => console.warn(error)
);
````

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
