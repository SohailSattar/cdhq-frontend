import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
	Button,
	ErrorAlert,
	ExportSelection,
	LoaderOverlay,
	Modal,
	NotAuthorized,
	RedirectButton,
	ShadowedContainer,
} from "..";
import { useStore } from "../../utils/store";
import { StatusType } from "../types";
import { ROLE, emptyFunction } from "../../utils";
// import { getMyRole } from "../../api/users/get/getMyRole";

import { Portal } from "@mui/material";

import styles from "./styles.module.scss";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";
import { APIExportData } from "../../api";

interface Props {
	lockFor?: ROLE[];
	displayContent?: boolean;
	title?: string;
	// Back to Project Home
	showBackButton?: boolean;
	btnBackUrlLink?: string;
	btnBackLabel?: string;

	//Edit
	showEditButton?: boolean;
	btnEditUrlLink?: string;

	// Add
	showAddButton?: boolean;
	btnAddUrlLink?: string;
	btnAddLabel?: string;

	// Change Status
	showChangeStatusButton?: boolean;
	currentStatus?: StatusType;
	onActivate?: () => void;
	onDectivate?: () => void;

	// Export
	isExportSelectionLoading?: boolean;
	displayExportButton?: boolean;
	exportDisplayNames?: any;
	onExcelExport?: (data: APIExportData) => void;
	onPdfExport?: (data: APIExportData) => void;

	///////////////////////////////
	className?: string;
	children: any;
	//////////////////////////////
	errors?: string[];
}
const PageContainer: FC<Props> = ({
	lockFor,
	displayContent,
	title,
	showBackButton = false,
	btnBackUrlLink,
	btnBackLabel,
	showEditButton = false,
	btnEditUrlLink,
	showAddButton = false,
	btnAddUrlLink,
	btnAddLabel,
	showChangeStatusButton = false,
	currentStatus,
	onActivate,
	onDectivate,
	isExportSelectionLoading = false,
	displayExportButton = false,
	exportDisplayNames,
	onExcelExport = emptyFunction,
	onPdfExport = emptyFunction,
	className,
	children,
	////////////////
	errors = [],
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [display, setDisplay] = useState<boolean>();

	const [isVisible, setIsVisible] = useState(false);

	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		const process = async () => {
			const { data } = await checkLoginStatus();
			if (data) {
				if (lockFor?.find((x) => x === data.role)) {
					setDisplay(false);
					setIsVisible(false);
				} else {
					if (displayContent !== undefined) {
						setDisplay(displayContent);
					} else {
						setDisplay(true);
					}
					setIsVisible(true);
					// animateActionSection();
				}
			}
		};

		process();
	}, [displayContent, display, lockFor]);

	return (
		<>
			{
				// display === undefined ? (
				// <Loader />
				// ) :
				display === false ? (
					<NotAuthorized />
				) : (
					<>
						<div className={styles.container}>
							{/* UNCOMMENT LATER ON */}
							{title && (
								<div className={styles.heading}>
									<span className={styles.title}>{title}</span>
								</div>
							)}

							<motion.div
								className={
									showBackButton ||
									showEditButton ||
									showAddButton ||
									showChangeStatusButton ||
									displayExportButton
										? styles.actionContainer
										: ""
								}
								initial={{ opacity: 0, visibility: "hidden" }}
								animate={{ opacity: isVisible ? 1 : 0, visibility: "visible" }}
								exit={{ opacity: 0 }}
								transition={{ duration: 1 }}>
								{showBackButton && (
									<motion.div
										className={styles.action}
										initial={{ opacity: 0 }}
										animate={{ opacity: isVisible ? 1 : 0 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}>
										<div className={styles.btnSection}>
											<div
												className={
													language !== "ar" ? styles.btn : styles.btnLTR
												}>
												<RedirectButton
													label={
														btnBackLabel!
															? btnBackLabel
															: t("button.backToHome", { framework: "React" })
													}
													redirectTo={btnBackUrlLink!}
												/>
											</div>
										</div>
									</motion.div>
								)}
								{(showEditButton ||
									showAddButton ||
									showChangeStatusButton) && (
									<motion.div
										className={styles.action}
										initial={{ opacity: 0 }}
										animate={{ opacity: isVisible ? 1 : 0 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}>
										<div className={styles.btnSection}>
											{showEditButton && (
												<div
													className={
														language !== "ar" ? styles.btn : styles.btnLTR
													}>
													<RedirectButton
														label={t("button.edit", { framework: "React" })}
														redirectTo={btnEditUrlLink!}
													/>
												</div>
											)}

											{showAddButton && (
												<div
													className={
														language !== "ar" ? styles.btn : styles.btnLTR
													}>
													<RedirectButton
														label={
															btnAddLabel
																? btnAddLabel
																: t("button.add", { framework: "React" })
														}
														redirectTo={btnAddUrlLink!}
													/>
												</div>
											)}

											{showChangeStatusButton && (
												<div
													className={
														language !== "ar" ? styles.btn : styles.btnLTR
													}>
													{currentStatus === "ACTIVE" ? (
														<Button
															onClick={onDectivate}
															isCritical>
															{t("button.deactivate", { framework: "React" })}
														</Button>
													) : (
														<Button onClick={onActivate}>
															{t("button.activate", { framework: "React" })}
														</Button>
													)}
												</div>
											)}
										</div>
									</motion.div>
								)}

								{displayExportButton && (
									<div>
										<Button
											withIcon
											tooltip={t("button.export", {
												framework: "React",
											})}
											onClick={() => setIsOpen(true)}>
											{t("button.export", {
												framework: "React",
											})}
										</Button>
									</div>
								)}
							</motion.div>
							<motion.div
								className={className}
								initial={{ opacity: 0 }}
								animate={{ opacity: isVisible ? 1 : 0 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.5, delay: 0.1 }}>
								{children}
							</motion.div>
						</div>
						<Portal>
							<Modal
								isOpen={isOpen}
								onClose={() => setIsOpen(false)}>
								<LoaderOverlay loading={isExportSelectionLoading}>
									<ExportSelection
										displayNames={exportDisplayNames}
										onExcelExport={onExcelExport}
										onPdfExport={onPdfExport}
									/>
								</LoaderOverlay>
							</Modal>
						</Portal>
						{errors.length > 0 && (
							<Portal>
								<ErrorAlert
									message="Error"
									errors={errors}
								/>
							</Portal>
						)}
					</>
				)
			}
		</>
	);
};

export default PageContainer;
