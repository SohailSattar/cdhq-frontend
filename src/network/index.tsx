/**
 * @description handeling network calls using axios
 *
 * TODO: make one network library from this network folder
 * to keep all projects network calls of organization syncronized
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *   /!\ DO NOT MODIFY THIS FILE /!\
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

import defaultRequest from './Interceptors/defaultRequest';
import defaultResponse from './Interceptors/defaultResponse';
import defaultResponseError from './Interceptors/defaultResponseError';
import defaultRequestError from './Interceptors/defaultRequestError';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import property from './property';
// import * as Endpoint from "./Endpoints";

const { isCancel, CancelToken } = axios;
type interceptorType = {
	setRequestInterceptor?: (
		config: AxiosRequestConfig
	) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
	setRequestInterceptorError?: (config: AxiosRequestConfig) => void;
	setResponseInterceptor?: (
		response: AxiosResponse
	) => AxiosResponse<any> | Promise<AxiosResponse<any>>;
	setResponseInterceptorError?: (response: AxiosResponse) => void;
};

const defaultInterceptors: interceptorType = {
	setRequestInterceptor: defaultRequest,
	setRequestInterceptorError: defaultRequestError,
	setResponseInterceptor: defaultResponse,
	setResponseInterceptorError: defaultResponseError,
};

const defaultConfig: AxiosRequestConfig = {
	baseURL: '',
	timeout: 240000,
};

const createInstance = (
	config: AxiosRequestConfig = defaultConfig,
	interceptors: interceptorType = {}
): AxiosInstance => {
	const instance = axios.create(config);

	instance.defaults.baseURL = property.BASE_URL;

	instance.defaults.headers.post['Content-Type'] =
		property.Default_Content_Type;

	const interceptorToSet = { ...defaultInterceptors, ...interceptors };

	// instance.defaults.headers.common = {
	// 	Authorization: `Bearer ${localStorageService.getJwtToken()}`,
	// };

	instance.interceptors.request.use(
		interceptorToSet.setRequestInterceptor,
		interceptorToSet.setRequestInterceptorError
	);

	return instance;
};

const instance = createInstance();

export { instance, isCancel, CancelToken }; //Endpoint,
