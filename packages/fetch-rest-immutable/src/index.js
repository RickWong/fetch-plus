/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import Immutable from "immutable";
import {compute} from "utils/compute";

// Export using middleware direct notation.
module.exports = (reviveRecord) => (request) => (response) => {
	return Immutable.fromJS(response, (key, value) => {
		return reviveRecord(key, value, request, response) || value;
	});
};
