import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Button, ShadowedContainer } from "..";

import styles from "./styles.module.scss";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
	showExport: boolean;
	onExportClick: () => void;
}

const ActionsContainer: FC<Props> = ({ showExport = true, onExportClick }) => {
	const [t] = useTranslation("common");
	return (
		<div className={styles.actionsContainer}>
			{showExport && (
				<ShadowedContainer className={styles.exportContainer}>
					{showExport && (
						<div>
							<Button
								withIcon
								tooltip={t("button.export", {
									framework: "React",
								})}
								onClick={onExportClick}>
								Export
								{/* <FontAwesomeIcon icon={faFileExcel} /> */}
							</Button>
						</div>
					)}
					{/* <div>
					<Button
						withIcon
						tooltip="Export to PDF"
						onClick={onPDFExportClick}>
						<FontAwesomeIcon icon={faFilePdf} />
					</Button>
				</div> */}
				</ShadowedContainer>
			)}
		</div>
	);
};

export default ActionsContainer;
