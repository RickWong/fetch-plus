/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import fetch from "isomorphic-fetch";
import {connectEndpoint} from "fetch-rest/src";
import basicauthMiddleware from "fetch-rest-basicauth/src";
import bearerauthMiddleware from "fetch-rest-bearerauth/src";
import csrfMiddleware from "fetch-rest-csrf/src";
import jsonMiddleware from "fetch-rest-json/src";
import useragentMiddleware from "fetch-rest-useragent/src";
import xmlMiddleware from "fetch-rest-xml/src";

async function main () {
	const api = connectEndpoint("http://jsonplaceholder.typicode.com", {
		headers: {
			Authorization: "Bearer hello_world"
		}
	}, [csrfMiddleware("X-Csrf-Token", "token"), jsonMiddleware]);

	api.addMiddleware(useragentMiddleware({
		"chrome": "1.0"
	}));

	api.addMiddleware(basicauthMiddleware("hello", "world"));

	api.addMiddleware((request) => ({error: (e) => {console.error("Rethrowing: ", e); throw e;}}));

	await api.browse("posts", {query:{_limit: 1}}).then(renderJSON);
	await api.browse("comments", {query:{_limit: 2, postId: 2}}).then(renderJSON);
	await api.read(["posts", 3]).then(renderJSON);
	await api.edit(["posts", 4], {body: "[]"}).then(renderJSON);
	await api.add("posts", {query:{postId: 5}, body: "[]"}).then(renderJSON);
	await api.replace(["posts", 6], {body: "[]"}).then(renderJSON);
	await api.destroy(["posts", 7]).then(renderJSON);
	await api.browse(["posts", 8, "comments"]).then(renderJSON);
	await api.browse(["posts", 9, "comments", 9]).catch((e) => console.warn(e)); // warning cannot "browse" single record
	await api.read(["posts", 10, "comments", 10], {query:{_limit: 1}}).catch((e) => console.error(e.status)); // 404
}

main();

function renderJSON (response) {
	if (!response) {
		return console.log("Received in console:", response);
	}

	console.log("Rendered response to screen");

	const root            = document.getElementById("react-root");
	root.style.fontFamily = "monospace";
	root.innerHTML += "" + JSON.stringify(response) + "<br/><br />";
}
