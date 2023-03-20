import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "..";

interface Props {
	label: string;
	redirectTo: string;
	style?: any;
	className?: string;
}
const RedirectButton: FC<Props> = ({ label, redirectTo, style, className }) => {
	const navigate = useNavigate();

	const redirectButtonClickHandler = () => {
		navigate(redirectTo);
	};

	return (
		<Button
			onClick={redirectButtonClickHandler}
			style={style}
			className={className}
		>
			{label}
		</Button>
	);
};

export default RedirectButton;
