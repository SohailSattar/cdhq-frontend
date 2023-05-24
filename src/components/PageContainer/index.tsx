import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	AuthorizedContainer,
	Button,
	NotAuthorized,
	RedirectButton,
	ShadowedContainer,
} from "..";
import { useStore } from "../../utils/store";
import { StatusType } from "../types";

import styles from "./styles.module.scss";
import { ROLE } from "../../utils";

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
	displayContent = true,
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

	const { role } = useStore((state) => state.loggedInUser);
	const [canView, setCanView] = useState<boolean>();

	useEffect(() => {
		if (lockFor?.find((x) => x === role)) {
			setCanView(false);
		} else {
			setCanView(true);
		}
	}, [lockFor]);

	return (
		<>
			{!displayContent || !canView ? (
				<NotAuthorized />
			) : (
				<div className={styles.container}>
					{title && (
						<div className={styles.heading}>
							<span className={styles.title}>{title}</span>
						</div>
					)}
					{showBackButton && (
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
					)}
					<div className={className}>{children}</div>
				</div>
			)}
		</>
	);
};

export default PageContainer;
