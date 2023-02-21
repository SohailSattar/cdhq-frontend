import { FC } from 'react';
import { NotAuthorized } from '..';

interface Props {
	isAuthorized?: boolean;
	children: any;
}

const AuthrorizedContainer: FC<Props> = ({ isAuthorized = true, children }) => {
	return !isAuthorized ? <></> : children;
};

export default AuthrorizedContainer;
