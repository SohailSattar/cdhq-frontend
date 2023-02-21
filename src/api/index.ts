import localStorageService from '../network/localStorageService';

export * from './types';

export const getConfig = (contentType = 'application/json') => {
	return {
		headers: {
			Authorization: 'Bearer ' + localStorageService.getJwtToken(),
			"Content-Type": contentType

		},
	};
};
