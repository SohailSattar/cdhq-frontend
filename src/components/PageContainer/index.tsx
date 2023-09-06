import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
	Button,
	Loading,
	NotAuthorized,
	RedirectButton,
	ShadowedContainer,
} from "..";
import { useStore } from "../../utils/store";
import { StatusType } from "../types";
import { ROLE } from "../../utils";
// import { getMyRole } from "../../api/users/get/getMyRole";

import styles from "./styles.module.scss";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";

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

	///////////////////////////////
	className?: string;
	children: any;
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
	className,
	children,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [display, setDisplay] = useState<boolean>();

	const [isVisible, setIsVisible] = useState(false);

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

	// useEffect(() => {
	// 	animate(scope.current, { opacity: 1 });
	// }, [animate, scope]);

	// useEffect(() => {
	// 	controls.start({
	// 		x: 0,
	// 		opacity: 1,
	// 		height: "auto",
	// 		transition: {
	// 			duration: 3,
	// 			type: "spring",
	// 			stiffness: 1000,
	// 			// damping: "10",
	// 			ease: [0, 0.71, 0.2, 1.01],
	// 		},
	// 	});
	// }, [controls]);

	return (
		<>
			{display === undefined ? (
				<Loading />
			) : display === false ? (
				<NotAuthorized />
			) : (
				<div className={styles.container}>
					{/* UNCOMMENT LATER ON */}
					{title && (
						<div className={styles.heading}>
							<span className={styles.title}>{title}</span>
						</div>
					)}
					{/* <button onClick={handleFadeIn}>Fade In</button>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: isVisible ? 1 : 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						style={{
							width: "200px",
							height: "200px",
							background: "blue",
							margin: "20px",
						}}>
						{isVisible ? "Visible" : "Hidden"}
					</motion.div> */}
					<motion.div
						className={styles.actionContainer}
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
								<ShadowedContainer className={styles.btnSection}>
									<div
										className={language !== "ar" ? styles.btn : styles.btnLTR}>
										<RedirectButton
											label={
												btnBackLabel!
													? btnBackLabel
													: t("button.backToHome", { framework: "React" })
											}
											redirectTo={btnBackUrlLink!}
										/>
									</div>
								</ShadowedContainer>
							</motion.div>
						)}
						{(showEditButton || showAddButton || showChangeStatusButton) && (
							<motion.div
								className={styles.action}
								initial={{ opacity: 0 }}
								animate={{ opacity: isVisible ? 1 : 0 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}>
								<ShadowedContainer className={styles.btnSection}>
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
								</ShadowedContainer>
							</motion.div>
						)}
					</motion.div>
					{/* {showBackButton && (
						<ShadowedContainer className={styles.btnSection}>
							<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
								<RedirectButton
									label={
										btnBackLabel!
											? btnBackLabel
											: t("button.backToHome", { framework: "React" })
									}
									redirectTo={btnBackUrlLink!}
								/>
							</div>
						</ShadowedContainer>
					)}
					{(showEditButton || showAddButton || showChangeStatusButton) && (
						<ShadowedContainer className={styles.btnSection}>
							{showEditButton && (
								<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
									<RedirectButton
										label={t("button.edit", { framework: "React" })}
										redirectTo={btnEditUrlLink!}
									/>
								</div>
							)}

							{showAddButton && (
								<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
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
								<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
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
						</ShadowedContainer>
					)} */}

					{/* <table style={{ width: "100%" }}>
						<tr>
							<td>
								{" "}
								{showBackButton && (
									<ShadowedContainer className={styles.btnSection}>
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
									</ShadowedContainer>
								)}
							</td>
							<td>
								{(showEditButton ||
									showAddButton ||
									showChangeStatusButton) && (
									<ShadowedContainer className={styles.btnSection}>
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
									</ShadowedContainer>
								)}
							</td>
						</tr>
					</table> */}
					<motion.div
						className={className}
						initial={{ opacity: 0 }}
						animate={{ opacity: isVisible ? 1 : 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}>
						{children}
					</motion.div>
				</div>
			)}
		</>
	);
};

export default PageContainer;
