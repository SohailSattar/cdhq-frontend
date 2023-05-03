import { FC, useEffect, useState } from "react";
import { Id } from "../../utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import styles from "./styes.module.scss";
import { useStore } from "../../utils/store";

interface Status {
	color: string;
}

interface Props {
	code: Id;
	showIcon?: boolean;
	showText?: boolean;
	text: string;
}

const ActiveStatus: FC<Props> = ({
	code,
	showIcon = true,
	showText = true,
	text,
}) => {
	const language = useStore((state) => state.language);

	const active: Status = { color: "#61ef61" };
	const deactive: Status = { color: "red" };

	return (
		<div className={styles.activeStatus}>
			{showIcon && (
				<div className={language !== "ar" ? styles.icon : styles.iconLTR}>
					<FontAwesomeIcon
						icon={faCircle}
						color={code === 7 || code === 1 ? active.color : deactive.color}
						className={code === 7 || code === 1 ? styles.blink : ""}
					/>
				</div>
			)}
			{showText && <div>{text}</div>}
		</div>
	);
};

export default ActiveStatus;
