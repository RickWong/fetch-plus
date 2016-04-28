/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

function compute (value) {
	return typeof value === "function" ? value() : value;
}

function computeObject (object) {
	object = compute(object);

	let mapped = {};

	Object.keys(object).forEach((key) => {
		const value = object[key];

		if (value === null) {
			mapped[key] = null;
		}
		else if (typeof FormData === "function" && value instanceof FormData) {
			mapped[key] = value;
		}
		else if (typeof value === "object") {
			mapped[key] = computeObject(value);
		}
		else {
			mapped[key] = compute(value);
		}
	});

	return mapped;
}

module.exports = {
	compute,
	computeObject
};
