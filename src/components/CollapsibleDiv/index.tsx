import React, { FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import { motion } from "framer-motion";

import styles from "./styles.module.scss";

interface Props {
	title?: string;
	children: any;
}

const CollapsibleDiv: FC<Props> = ({ title = "", children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleCollapsible = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={styles.collapsible}>
			<Button
				onClick={toggleCollapsible}
				className={styles.btn}>
				<FontAwesomeIcon
					className={styles.pin}
					icon={faThumbtack}
					style={{ marginRight: "5px" }}
				/>
				{/* {isOpen ? "Collapse" : "Expand"} {title} */}
			</Button>
			<motion.div
				initial={{ height: 0 }}
				animate={{ height: isOpen ? "auto" : 0 }}
				transition={{ duration: 0.3 }}
				style={{ overflow: "hidden" }}>
				{isOpen && <div>{children}</div>}{" "}
			</motion.div>
		</div>
	);
};

export default CollapsibleDiv;
