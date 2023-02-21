export const SET_USER_LOGGED_IN = "IS_USER_LOGGED_IN";

export const SET_USER_INFO = "SET_USER_INFO";

export const LOGIN_LOADING = "LOAGIN_LOADING";

export const OPEN_DIALOG = "LOPEN_DIALOG";

export const GLOBAL_SNACKBAR = "GLOBAL_SNACKBAR";

export const setUserLoginStatus = (payload: any) => ({
	type: SET_USER_LOGGED_IN,
	payload,
});

export const setUserInfoDetails = (payload: any) => ({
	type: SET_USER_INFO,
	payload,
});

export const setLoginLoad = (payload: any) => ({
	type: LOGIN_LOADING,
	payload,
});

export const setDialogOpen = (payload: any) => ({
	type: OPEN_DIALOG,
	payload,
});

export const setGlobalSnackbar = (payload: any) => ({
	type: GLOBAL_SNACKBAR,
	payload,
});
