import clsx from "clsx";
import { FC } from "react";
import { Link } from "react-router-dom";

import styles from "./styles.module.scss";
import { Button } from "..";

interface Props {
	message: any;
	type: "primary" | "error" | "notification";
	url?: string;
	urlText?: string;
	btnText?: string;
	onClick?: () => void;
}

const MessageBox: FC<Props> = ({
	message,
	type,
	url,
	urlText,
	btnText,
	onClick = () => {},
}) => {
	let stylingClass;

	if (type === "error") {
		stylingClass = styles.errorSection;
	} else if (type === "notification") {
		stylingClass = styles.notifySection;
	}

	return (
		<div className={clsx(styles.messageBox, stylingClass)}>
			<div>{message}</div>
			{url && (
				<div>
					<Link to={url}>{!urlText ? url : urlText}</Link>
				</div>
			)}
			{btnText && <Button onClick={onClick}>{btnText}</Button>}
		</div>
	);
};

export default MessageBox;
