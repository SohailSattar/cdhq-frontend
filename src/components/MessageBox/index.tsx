import clsx from "clsx";
import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "..";

import styles from "./styles.module.scss";

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
		<motion.div
			className={clsx(styles.messageBox, stylingClass)}
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			transition={{ type: "spring", damping: 10, stiffness: 100 }}>
			<div>{message}</div>
			{url && (
				<div>
					<Link to={url}>{!urlText ? url : urlText}</Link>
				</div>
			)}
			{btnText && <Button onClick={onClick}>{btnText}</Button>}
		</motion.div>
	);
};

export default MessageBox;
