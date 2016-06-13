/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */

const _isScalar = (value) => {
	return (
		value === undefined ||
		value === null ||
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	);
};

const compute = (value) => {
	return typeof value === "function" ? value() : value;
}

const computeObject = (object) => {
	object = compute(object);

	if (_isScalar(object)) {
		return object;
	}

	let mapped = Array.isArray(object) ? [] : {};

	Object.keys(object).forEach((key) => {
		const value = object[key];

		if (_isScalar(value)) {
			mapped[key] = value;
		}
		else if ((typeof FormData === "object" || typeof FormData === "function") && value instanceof FormData) {
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
