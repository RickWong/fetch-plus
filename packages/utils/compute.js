/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

function compute (value) {
	return typeof value === "function" ? value() : value;
}

function computeObject (object, exceptForKeys = []) {
	let mapped = {};
	object = compute(object);

	Object.keys(object).forEach((key) => {
		if (exceptForKeys.indexOf(key) >= 0) {
			return;
		}

		const value = object[key];

		mapped[key] = typeof value === "object" ? computeObject(value) : compute(value);
	});

	return mapped;
}

module.exports = {
	compute,
	computeObject
};
