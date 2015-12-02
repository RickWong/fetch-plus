/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import Immutable from "immutable";

// Export using middleware direct notation.
module.exports = (reviver) => (request) => (response) => {
	return Immutable.fromJS(response, reviver);
};
