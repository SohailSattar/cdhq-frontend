import React, { FC } from "react";
import ReactModal from "react-modal";

import cross from "../../assets/icons/cross.svg";

import styles from "./styles.module.scss";
import "./style.scss";
import clsx from "clsx";

interface Props {
	hideXButton?: boolean;
	isOpen: boolean;
	onClose: () => void;
	children: any;
	className?: string;
}

export const Modal: FC<Props> = ({
	hideXButton = false,
	isOpen,
	children,
	onClose,
	className = "",
}) => {
	return (
		<ReactModal
			className={clsx(styles.modalPopup, className)}
			isOpen={isOpen}
			ariaHideApp={false}
			shouldCloseOnOverlayClick={true}>
			{!hideXButton && (
				<div className={styles.closeLine}>
					<img
						onClick={onClose}
						src={cross}
						alt="close"
					/>
				</div>
			)}
			<div className={styles.content}>{children}</div>
		</ReactModal>
	);
};

export default Modal;
