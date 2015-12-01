/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

// Export using middleware creation notation.
module.exports = (token) => (request) => {
	request.options.headers["Authorization"] = "Bearer " + token;
};
