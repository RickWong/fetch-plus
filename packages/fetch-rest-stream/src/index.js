/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
function readChunk (observer, response) {
	return getBodyReader(response).read().then((chunk) => {
		try {
			if (chunk.done) {
				if (observer.complete) {
					return observer.complete(chunk); // ES Observable
				}

				if (observer.onCompleted) {
					return observer.onCompleted(chunk); // Rx Observable
				}

				return;
			}

			if (chunk.value) {
				let result;

				if (observer.next) {
					result = observer.next(chunk); // ES Observable
				}
				else if (observer.onNext) {
					result = observer.onNext(chunk); // Rx Observable
				}

				if (result === false) {
					return getBodyReader(response).cancel();
				}
			}
		}
		catch (error) {
			let result;

			if (observer.error) {
				result = observer.error(error); // ES Observable
			}
			else if (observer.onError) {
				result = observer.onError(error); // Rx Observable
			}

			if (result === false) {
				return;
			}

			throw error;
		}

		return readChunk(observer, response);
	});
}

function getBodyReader (response) {
	if (response._bodyReader) {
		return response._bodyReader;
	}

	if (!response.body) {
		throw new ReferenceError("Response body not available");
	}

	if (typeof response.body.getReader !== "function") {
		throw new TypeError("body.getReader() stream not available");
	}

	return response._bodyReader = response.body.getReader();
}

const handler = (observer) => (response) => {
	return readChunk({...observer}, response);
};

module.exports = (observer) => (request) => (response) => {
	return handler(observer)(response);
};

module.exports.handler = handler;
