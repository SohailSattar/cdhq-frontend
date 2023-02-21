import {
	GLOBAL_SNACKBAR,
	LOGIN_LOADING,
	OPEN_DIALOG,
	SET_USER_INFO,
	SET_USER_LOGGED_IN,
} from './Actions';

const initialState: any = {
	isUserLoggedIn: false,
	info: {},
	loginLoding: false,
	openDialog: false,
	globalSnackbar: {},
};

export const AppContextReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_USER_LOGGED_IN:
			return {
				...state,
				isUserLoggedIn: action.payload,
			};
		case SET_USER_INFO:
			return {
				...state,
				info: action.payload,
			};
		case LOGIN_LOADING:
			return {
				...state,
				loginLoding: action.payload,
			};
		case OPEN_DIALOG:
			return {
				...state,
				openDialog: action.payload,
			};
		case GLOBAL_SNACKBAR:
			return {
				...state,
				globalSnackbar: action.payload,
			};

		default:
			return state;
	}
};
