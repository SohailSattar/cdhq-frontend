const localStorageService = (() => {
	var _service: any;
	const _getService = () => {
		if (!_service) {
			_service = this;
			return _service;
		}
		return _service;
	};

	const _setToken = (tokenObj: {
		access_token: string;
		refresh_token: string;
	}) => {
		localStorage.setItem("access_token", tokenObj?.access_token);
		localStorage.setItem("refresh_token", tokenObj?.refresh_token);
	};

	const _setJwtToken = (token: string) => {
		localStorage.setItem("token", token);
	};

	const _getJwtToken = () => {
		return localStorage.getItem("token");
	};

	const _setLanguage = (language: string) => {
		localStorage.setItem("language", language);
	};

	const _getLanguage = () => {
		return localStorage.getItem("language");
	};

	const _setUserInfo = (info: any) => {
		localStorage.setItem("info", JSON.stringify(info));
	};

	const _getUserInfo = () => {
		return JSON.parse(localStorage.getItem("info")!);
	};

	const _getAccessToken = () => {
		return localStorage.getItem("access_token");
	};
	const _getRefreshToken = () => {
		return localStorage.getItem("refresh_token");
	};

	// Session Token

	const _setSessionToken = (token: any) => {
		localStorage.setItem("sessionToken", JSON.stringify(token));
	};

	const _getSessionToken = () => {
		return JSON.parse(localStorage.getItem("sessionToken")!);
	};

	const _clearToken = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("token");
		localStorage.removeItem("info");
		localStorage.removeItem("state");
		localStorage.removeItem("language");
		localStorage.removeItem("sessionToken");
	};

	return {
		getService: _getService,
		setToken: _setToken,
		getAccessToken: _getAccessToken,
		getRefreshToken: _getRefreshToken,
		clearToken: _clearToken,
		setJwtToken: _setJwtToken,
		getUserInfo: _getUserInfo,
		getJwtToken: _getJwtToken,
		setUserInfo: _setUserInfo,
		setLanguage: _setLanguage,
		getLanguage: _getLanguage,
		getSessionToken: _getSessionToken,
		setSessionToken: _setSessionToken,
	};
})();

export default localStorageService;
