/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import __fetch from "isomorphic-fetch";
import {createEndpoint} from "lib/fetch-rest";

function createApi ()
{
	const endpoint = createEndpoint("http://jsonplaceholder.typicode.com", {
		headers: {
			Authorization: "Bearer hello_world"
		}
	});

	endpoint.posts    = endpoint.createResource("posts");
	endpoint.comments = endpoint.createResource("comments");
	endpoint.albums   = endpoint.createResource("albums");
	endpoint.photos   = endpoint.createResource("photos");
	endpoint.todos    = endpoint.createResource("todos");
	endpoint.users    = endpoint.createResource("users");

	return endpoint;
}

const api = createApi();

api.posts.browse({_limit: 1}, {}).then(res => res.json()).then(renderJSON);

api.comments.browse({_limit: 2, postId: 2}, {}).then(res => res.json()).then(renderJSON);

api.posts.read(3, {}, {}).then(res => res.json()).then(renderJSON);

api.posts.edit(4, {}, {body: "body"}).then(res => res.json()).then(renderJSON);

api.posts.add({postId: 5}, {body: "body"}).then(res => res.json()).then(renderJSON);

api.posts.replace(6, {}, {body: "body"}).then(res => res.json()).then(renderJSON);

api.posts.destroy(7, {}, {}).then(res => res.json()).then(renderJSON);


function renderJSON (json) {
	const root            = document.getElementById("react-root");
	root.style.fontFamily = "monospace";
	root.innerHTML += "" + JSON.stringify(json) + "<br/>";
}
