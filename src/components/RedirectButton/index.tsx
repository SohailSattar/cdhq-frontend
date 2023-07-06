import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "..";

import * as RoutePath from "../../RouteConfig";

interface Props {
	label: string;
	redirectTo: string;
	style?: any;
	className?: string;
	openInNewTab?: boolean;
}
const RedirectButton: FC<Props> = ({
	label,
	redirectTo,
	style,
	className,
	openInNewTab = false,
}) => {
	const navigate = useNavigate();

	const redirectButtonClickHandler = () => {
		navigate(redirectTo);
	};

	return openInNewTab ? (
		<a
			href={RoutePath.BASE_NAME + redirectTo}
			target="_blank">
			<Button
				style={style}
				className={className}>
				{label}
			</Button>
		</a>
	) : (
		<Button
			onClick={redirectButtonClickHandler}
			style={style}
			className={className}>
			{label}
		</Button>
	);
};

export default RedirectButton;
