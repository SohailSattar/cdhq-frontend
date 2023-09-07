import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "..";
import { useStore } from "../../utils/store";

import styles from "./styles.module.scss";

export interface Props {
	message?: string;
	isOpen?: boolean;
	onYesClick: () => void;
	onCancelClick: () => void;
}

const DeleteConfirmation: FC<Props> = ({
	isOpen = false,
	onYesClick,
	onCancelClick,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const yesButtonClickHandler = () => {
		onYesClick();
	};

	const cancelButtonClickHandler = () => {
		onCancelClick();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={cancelButtonClickHandler}
			hideXButton={true}>
			<div
				className={
					language !== "ar" ? styles.confirmationBox : styles.confirmationBoxLTR
				}>
				<div>{t("message.delete", { framework: "React" })}</div>
				<div className={styles.btnSection}>
					<Button
						className={styles.btn}
						onClick={yesButtonClickHandler}
						isCritical>
						{t("button.yes", { framework: "React" })}
					</Button>
					<Button onClick={cancelButtonClickHandler}>
						{t("button.cancel", { framework: "React" })}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteConfirmation;
