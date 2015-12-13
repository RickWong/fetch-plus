/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import fetch from "isomorphic-fetch";
import Immutable from "immutable";
import {connectEndpoint} from "fetch-plus/src";
import basicauthMiddleware from "fetch-plus-basicauth/src";
import bearerauthMiddleware from "fetch-plus-bearerauth/src";
import csrfMiddleware from "fetch-plus-csrf/src";
import immutableMiddleware from "fetch-plus-immutable/src";
import jsonMiddleware from "fetch-plus-json/src";
import oauthMiddleware from "fetch-plus-oauth/src";
import useragentMiddleware from "fetch-plus-useragent/src";
import xmlMiddleware from "fetch-plus-xml/src";
import streamMiddleware from "fetch-plus-stream/src";

async function main () {
	const api = connectEndpoint("http://jsonplaceholder.typicode.com");

	api.addMiddleware(useragentMiddleware({"fetch-plus": "1.0.0"}));
	api.addMiddleware(csrfMiddleware("X-Csrf-Token", "csrf_token"));
	api.addMiddleware(basicauthMiddleware("hello", "world"));
	api.addMiddleware(streamMiddleware({
		content: "",
		next (chunk) {
			console.log("NEXT");
			this.content += "" + String.fromCharCode.apply(null, chunk.value);
		},
		complete (chunk) {
			console.log("COMPLETE");
			return {
				ok: true,
				json: () => JSON.parse(this.content)
			};
		},
		error (error) {
			console.log("ERROR");
		}
	}));
	api.addMiddleware(jsonMiddleware());
	api.addMiddleware(immutableMiddleware((key, value, request, response) => {
		if (Immutable.Iterable.isIndexed(value)) {
			return value.toList();
		}

		if (request.path.match(/(^|\/)posts(\/.+)?$/)) {
			return new (Immutable.Record({userId: 0, id: 0, title: "", body: ""}))(value);
		}

		if (request.path.match(/(^|\/)comments(\/.+)$/)) {
			return new (Immutable.Record({postId: 0, id: 0, name: "", email: "", body: ""}))(value);
		}

		return value;
	}));

	api.addMiddleware((request) => ({error: (e) => {console.warn("Rethrowing: ", e&&e.stack||e); throw e;}}));

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
	console.log("Rendered response to screen");

	const root            = document.getElementById("react-root");
	root.style.fontFamily = "monospace";
	root.innerHTML += "" + JSON.stringify(response) + "<br/><br />";
}
