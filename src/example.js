/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import __fetch from "isomorphic-fetch";
import {createEndpoint} from "lib/fetch-rest";

async function main () {
	const api = createEndpoint("http://jsonplaceholder.typicode.com", {
		headers: {
			Authorization: "Bearer hello_world"
		}
	}, [(request) => {
		request.options.headers["Content-Type"] = "application/json; charset=utf-8";

		return (response) => response.json();
	}]);

	await api.browse("posts", {_limit: 1}).then(renderJSON);
	await api.browse("comments", {_limit: 2, postId: 2}).then(renderJSON);
	await api.read(["posts", 3]).then(renderJSON);
	await api.edit(["posts", 4], {}, {body: "[]"}).then(renderJSON);
	await api.add("posts", {postId: 5}, {body: "[]"}).then(renderJSON);
	await api.replace(["posts", 6], {}, {body: "[]"}).then(renderJSON);
	await api.destroy(["posts", 7]).then(renderJSON);
	await api.browse(["posts", 8, "comments"]).then(renderJSON);
	await api.browse(["posts", 9, "comments", 9]).catch((e) => console.warn(e)); // cannot browse single record
	await api.read(["posts", 10, "comments", 10], {_limit: 1}).catch((e) => console.warn(e)); // 404
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
