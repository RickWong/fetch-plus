/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

function compute (value) {
	return typeof value === "function" ? value() : value;
}

function computeObject (object) {
	let mapped = {};
	object = compute(object);

	Object.keys(object).forEach((key) => {
		const value = object[key];

		if (value === null) {
			mapped[key] = null;
		}
		else {
			mapped[key] = typeof value === "object" ? computeObject(value) : compute(value);
		}
	});

	return mapped;
}

module.exports = {
	compute,
	computeObject
};
