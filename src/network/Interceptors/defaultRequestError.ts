export default function defaultRequestError(error: Object) {
	//this should not happen ever
	return Promise.reject(error);
}
