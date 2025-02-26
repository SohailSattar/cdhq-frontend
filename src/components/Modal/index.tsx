import React, { FC, useState } from "react";
import ReactModal from "react-modal";

import cross from "../../assets/icons/cross.svg";

import styles from "./styles.module.scss";
import "./style.scss";
import clsx from "clsx";
import { motion } from "framer-motion";

interface Props {
	hideXButton?: boolean;
	isOpen: boolean;
	onClose: () => void;
	children: any;
	className?: string;
}

const customStyles = {
	overlay: {
		// backgroundColor: "rgba(0, 0, 0, 0.3)",
		display: "flex",
		justifyContent: "center",
		// alignItems: "center",
	},
	content: {
		background: "white",
		// padding: "20px",
		maxWidth: "80%",
		maxHeight: "95%",
		overflow: "auto",
	},
};

export const Modal: FC<Props> = ({
	hideXButton = false,
	isOpen,
	children,
	onClose,
	className = "",
}) => {
	const closeHandler = () => {
		setTimeout(() => {
			onClose();
		}, 300);
	};

	return (
		<ReactModal
			className={clsx(styles.modalPopup, className)}
			isOpen={isOpen}
			ariaHideApp={false}
			shouldCloseOnOverlayClick={true}
			style={customStyles}>
			<motion.div
				className="modal"
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -50 }}
				transition={{ type: "spring", damping: 10, stiffness: 50 }}>
				{!hideXButton && (
					<div className={styles.closeLine}>
						<img
							onClick={closeHandler}
							src={cross}
							alt="close"
						/>
					</div>
				)}
				<div className={styles.content}>{children}</div>
			</motion.div>
		</ReactModal>
	);
};

export default Modal;
