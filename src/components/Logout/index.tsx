import { FC } from 'react';
import { Button } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import localStorageService from '../../network/localStorageService';

interface Props {
	label: string;
	onClick?: () => void;
	className?: string;
}

const Logout: FC<Props> = ({ label, onClick = () => {}, className }) => {
	const [, , removeCookie] = useCookies([
		'id',
		'name',
		'nameEnglish',
		'userName',
		'role',
	]);

	const removeLocalStorageData = () => {
		localStorageService.clearToken();
	};

	const removeCookies = () => {
		removeCookie('id', { path: '/' });
		removeCookie('name', { path: '/' });
		removeCookie('nameEnglish', { path: '/' });
		removeCookie('userName', { path: '/' });
		removeCookie('role', { path: '/' });
	};

	const logoutClickHandler = () => {
		removeLocalStorageData();
		removeCookies();
		onClick();
	};

	return (
		<Button onClick={logoutClickHandler} className={className}>
			{label}
		</Button>
	);
};

export default Logout;
