import { Button } from '@material-ui/core';
import { FC } from 'react';

interface Props {
	fullName: string;
	userName: string;
	onClick?: () => void;
	className?: string;
}

const LoggedUser: FC<Props> = ({ fullName, userName, onClick, className }) => {
	return (
		<>
			<Button onClick={onClick} className={className}>
				{fullName} [{userName}]
			</Button>
		</>
	);
};

export default LoggedUser;
