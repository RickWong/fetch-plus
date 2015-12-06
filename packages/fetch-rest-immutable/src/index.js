/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
import Immutable from "immutable";
import {compute} from "utils/compute";

const defaultReviver = (key, value) => {
	if (Immutable.Iterable.isIndexed(value)) {
		return value.toList();
	}

	return value.toOrderedMap();
};

// Export using middleware direct notation.
module.exports = (reviveRecord) => (request) => (response) => {
	return Immutable.fromJS(response, (key, value) => {
		if (reviveRecord) {
			return reviveRecord(key, value, request, response);
		}

		return defaultReviver(key, value);
	});
};
