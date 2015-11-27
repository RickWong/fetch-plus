# fetch-rest

Generic REST API client using [Fetch API](https://github.com/whatwg/fetch).

![version](https://img.shields.io/npm/v/fetch-rest.svg) ![license](https://img.shields.io/npm/l/fetch-rest.svg) ![installs](https://img.shields.io/npm/dt/fetch-rest.svg)

## Features

- Uses the standard Fetch API.
- Generic interface to communicate with any REST API client as you need.
- Runs in Node and browsers. (BYO Fetch API and Promises polyfills though)

## Installation

```bash
	npm install --save fetch-rest
```

## Usage

````js
import {createEndpoint} from "fetch-rest";

const jsonApi = createEndpoint(
	"http://jsonplaceholder.typicode.com",  // API server URL
	{cache: "no-cache"}                     // Fetch API options
);

jsonApi.browse(             // REST action: browse, read, edit, add, destroy, or replace
	"comments",             // Resource name or array [name, [...id, [...name, [...id]]] et cetera]
	{postId: 12},           // Query string parameters
	{json: true}            // Additional Fetch API options
).then(
	json => console.log(json)
).catch(
	error => console.warn(error)
);
````

## Community

Let's start one together! After you ★Star this project, follow me [@Rygu](https://twitter.com/rygu)
on Twitter.

## License

BSD 3-Clause license. Copyright © 2015, Rick Wong. All rights reserved.
