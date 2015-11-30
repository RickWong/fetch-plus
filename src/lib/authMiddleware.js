/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

// Export using middleware creation notation.
export default (token) => (request) => {
	request.options.headers["Authorization"] = "Bearer " + token;
};
