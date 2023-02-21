import { FC, useContext, useMemo } from 'react';
import { DispatchContext } from '../context';
import * as Actions from '../context/Actions';
import localStorageService from './localStorageService';
import { instance } from './index';

interface Props {
	children: any;
}

const WithAxios: FC<Props> = ({ children }) => {
	const dispatch = useContext(DispatchContext);

	useMemo(() => {
		instance.interceptors.response.use(
			(res) => res,
			(error: any = {}) => {
				if (error.response.status === 403) {
					localStorageService.clearToken();
					dispatch(Actions.setDialogOpen(true));
					dispatch(Actions.setUserLoginStatus(false));
				} else {
					dispatch(
						Actions.setGlobalSnackbar({
							message: error?.response?.data?.message,
							show: true,
						})
					);
				}
				return Promise.reject(error);
			}
		);
	}, [dispatch]);

	return children;
};

export default WithAxios;
