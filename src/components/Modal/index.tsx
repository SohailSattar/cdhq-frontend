import React, { FC } from "react";
import ReactModal from "react-modal";

import cross from "../../assets/icons/cross.svg";

import styles from "./styles.module.scss";
import "./style.scss";

interface Props {
	hideXButton?: boolean;
	isOpen: boolean;
	onClose: () => void;
	children: any;
}

export const Modal: FC<Props> = ({
	hideXButton = false,
	isOpen,
	children,
	onClose,
}) => {
	return (
		<ReactModal
			className={styles.modalPopup}
			isOpen={isOpen}
			ariaHideApp={false}
			shouldCloseOnOverlayClick={true}
		>
			{!hideXButton && (
				<div className={styles.closeLine}>
					<img onClick={onClose} src={cross} alt="close" />
				</div>
			)}
			<div className={styles.content}>{children}</div>
		</ReactModal>
	);
};

export default Modal;
