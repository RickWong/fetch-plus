/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import __fetch from "isomorphic-fetch";
import {describeEndpoint, describeResource} from "lib/fetch-rest";

function renderJSON (json) {
	const root            = document.getElementById("react-root");
	root.style.fontFamily = "monospace";

	root.innerHTML += "" + JSON.stringify(json) + "<br/>";
}

try {
	const endpoint = describeEndpoint("http://jsonplaceholder.typicode.com", {
		headers: {
			Authorization: "Bearer hello_world"
		}
	});

	const posts    = describeResource(endpoint, "posts");
	const comments = describeResource(endpoint, "comments");
	const albums   = describeResource(endpoint, "albums");
	const photos   = describeResource(endpoint, "photos");
	const todos    = describeResource(endpoint, "todos");
	const users    = describeResource(endpoint, "users");

	posts.browse({_limit: 10}, {}).then(res => res.json()).then(renderJSON);

	comments.browse({_limit: 10, postId: 1}, {}).then(res => res.json()).then(renderJSON);

	posts.read(2, {}, {}).then(res => res.json()).then(renderJSON);

	posts.edit(3, {}, {body: "whatsup"}).then(res => res.json()).then(renderJSON);

	posts.add({}, {body: "whatsup"}).then(res => res.json()).then(renderJSON);

	posts.replace(4, {}, {body: "whatsup"}).then(res => res.json()).then(renderJSON);

	posts.destroy(5, {}, {}).then(res => res.json()).then(renderJSON);
}

catch (error)
{
	throw error;
}
