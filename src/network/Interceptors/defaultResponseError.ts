// const localStorageService = localStorageService.getService();

// handle genric error like 401, 500, 501  at gloabl project level

// const requestBody = {
//   accessToken: 'QQFKKqWYsQcTqrNy926Ypz',
//   refreshToken: 'QZLBpuf79mypC8uSRgt6Tc',
// };

// let requestBody = {
//   accessToken: localStorageService.getAccessToken(),
//   refreshToken: localStorageService.getRefreshToken(),
// };

export default function defaultResponseError(error: any = {}) {
	// if (params?.hasOwnProperty('access_token')){
	//   requestBody = {
	//     accessToken: params?.access_token,
	//     refreshToken: params?.refresh_token,
	//   };
	// }

	const originalRequest = error.config;
	if (error.response.status === 403 && !originalRequest._retry) {
		// originalRequest._retry = true;
		// return axios.post('/api/bet/session/v1/login',requestBody)
		//     .then(res => {
		//         if (res.status === 200) {
		//             // 1) put token to LocalStorage
		//             localStorageService?.setJwtToken(res.data);
		//             return axios(originalRequest);
		//         }
		//     })

		return error;
	}

	// return Error object with Promise
	return error;
}
