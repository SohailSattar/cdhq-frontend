import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '..';

interface Props {
	label: string;
	redirectTo: string;
	style?: any;
}
const RedirectButton: FC<Props> = ({ label, redirectTo, style }) => {
	const navigate = useNavigate();

	const redirectButtonClickHandler = () => {
		navigate(redirectTo);
	};

	return (
		<Button onClick={redirectButtonClickHandler} style={style}>
			{label}
		</Button>
	);
};

export default RedirectButton;
