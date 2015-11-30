/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

// Export using middleware notation.
export default (token) => (request) => {
	request.options.headers["Authorization"] = "Bearer " + token;
};
