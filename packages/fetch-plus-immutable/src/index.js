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

module.exports = (reviveRecord) => (request) => (response) => {
	return Immutable.fromJS(
		response,
		(key, value) => (reviveRecord ? reviveRecord(key, value, request, response) : defaultReviver(key, value))
	);
};

module.exports.handler = (reviveRecord) => (response) => {
	return Immutable.fromJS(
		response,
		(key, value) => (reviveRecord ? reviveRecord(key, value, undefined, response) : defaultReviver(key, value))
	);
};
