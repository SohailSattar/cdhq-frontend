import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Id } from "../../utils";
import Button from "../Button";
import DeleteConfirmation from "../DeleteConfirmation";
import RedirectButton from "../RedirectButton";

import styles from "./styles.module.scss";

export interface Props {
	id: Id;
	detailPageLink?: string;
	showView?: boolean;
	showEdit?: boolean;
	editPageLink?: string;
	onEdit?: (id: string) => void;
	showDelete?: boolean;
	onDelete?: (id: Id) => void;
}

const ActionButtons: FC<Props> = ({
	id,
	detailPageLink = "",
	showView,
	showEdit,
	editPageLink,
	onEdit = () => {},
	showDelete = false,
	onDelete = () => {}
}) => {
	const [t, i18n] = useTranslation("common");

	const [isEditMode, setIsEditMode] = useState(false);

	const [showModal, setShowModal] = useState(false);

	const onEditClick = () => {
		setIsEditMode(true);
		onEdit(id.toString());
	};

	const onCancelClick = () => {
		setIsEditMode(false);
	};

	const deleteClickHandler = () => {
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = () => {
		setShowModal(false);
		onDelete(id);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<>
			<div className={styles.actionButtons}>
				{showView && (
					<div className={styles.divBtn}>
						<RedirectButton
							label={t("button.view", { framework: "React" })}
							redirectTo={detailPageLink}
						/>
					</div>
				)}
				{!isEditMode && showEdit && (
					<div className={styles.divBtn}>
						{editPageLink ? (
							<RedirectButton
								label={t("button.edit", { framework: "React" })}
								redirectTo={editPageLink!}
							/>
						) : (
							<Button onClick={onEditClick}>
								{t("button.edit", { framework: "React" })}
							</Button>
						)}
					</div>
				)}
				{isEditMode && showEdit && (
					<div className={styles.divBtn}>
						<Button>{t("button.update", { framework: "React" })}</Button>
					</div>
				)}
				{showDelete && (
					<div className={styles.divBtn}>
						<Button isCritical onClick={deleteClickHandler}>
							{t("button.delete", { framework: "React" })}
						</Button>
					</div>
				)}
				{isEditMode && (
					<div className={styles.divBtn}>
						<Button onClick={onCancelClick}>Cancel</Button>
					</div>
				)}
			</div>

			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</>
	);
};

export default ActionButtons;
