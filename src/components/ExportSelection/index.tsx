import { ChangeEvent, useEffect, useMemo, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	CheckBoxSelections,
	Checkbox,
	RadioButton,
	ShadowedContainer,
} from "..";
import { APIExportData, PropertyDisplayNames } from "../../api";

import { ReactComponent as XLSXIcon } from "../../assets/icons/xlsx.svg";
import { ReactComponent as PdfIcon } from "../../assets/icons/pdf.svg";

import { useTranslation } from "react-i18next";

import styles from "./styles.module.scss";

interface Props<T> {
	displayNames: PropertyDisplayNames<T>;
	onExcelExport: (data: APIExportData) => void;
	onPdfExport: (data: APIExportData) => void;
}

const ExportSelection = <T extends Record<string, any>>({
	displayNames,
	onExcelExport,
	onPdfExport,
}: Props<T>) => {
	const [t] = useTranslation("common");
	const [dynamicObject, setDynamicObject] = useState<{ [key: string]: string }>(
		{}
	);

	const [isSelectAll, setIsSelectAll] = useState<boolean>(true);
	const [properties, setProperties] = useState<{ [key: string]: string }[]>([]);

	const [isPaged, setIsPaged] = useState<boolean>(true);

	const selectAllClickHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const isChecked = event.target.checked;
		setIsSelectAll(isChecked);

		if (isChecked) {
			setProperties([]);
		}
	};

	const propertyChangeHandler = useMemo(
		() => (x: { [key: string]: string }[]) => {
			setProperties(x);
		},
		[setProperties]
	);

	const excelExportClickHandler = useMemo(
		() => () => {
			const newDynamicObject = properties.reduce((acc, obj) => {
				acc[obj.value] = obj.text;
				return acc;
			}, {});

			// Update the state with the new dynamic object
			setDynamicObject(newDynamicObject);

			const params: APIExportData = {
				format: "xlsx",
				selectedFields: newDynamicObject,
				isPaged: isPaged,
			};

			onExcelExport(params);
		},
		[isPaged, onExcelExport, properties]
	);

	const pdfExportClickHandler = useMemo(
		() => () => {
			const newDynamicObject = properties.reduce((acc, obj) => {
				acc[obj.value] = obj.text;
				return acc;
			}, {});

			// Update the state with the new dynamic object
			setDynamicObject(newDynamicObject);

			const params: APIExportData = {
				format: "pdf",
				selectedFields: newDynamicObject,
				isPaged: isPaged,
			};

			onPdfExport(params);
		},
		[isPaged, onPdfExport, properties]
	);

	const useCurrentPageCheckHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setIsPaged(event.target.checked);
	};

	return (
		<div className={styles.exportSelection}>
			<ShadowedContainer>
				<section className={styles.title}>
					{t("export.fieldsSelectTitle", { framework: "React" })}
				</section>
				<hr />
				<div>
					<Checkbox
						label={t("export.selectAll", {
							framework: "React",
						})}
						onChange={selectAllClickHandler}
						checked={isSelectAll}
					/>
				</div>
				<hr />
				<CheckBoxSelections
					displayNames={displayNames}
					onPropertyChange={propertyChangeHandler}
					isSelectAll={isSelectAll}
				/>
			</ShadowedContainer>
			<ShadowedContainer>
				<Checkbox
					label={t("export.useCurrentPage", { framework: "React" })}
					checked={isPaged}
					onChange={useCurrentPageCheckHandler}
				/>
			</ShadowedContainer>
			<ShadowedContainer className={styles.actions}>
				<Button
					onClick={excelExportClickHandler}
					tooltip={t("export.excel", {
						framework: "React",
					})}
					className={styles.action}>
					<XLSXIcon className={styles.icon} />
				</Button>
				<Button
					onClick={pdfExportClickHandler}
					tooltip={t("export.pdf", {
						framework: "React",
					})}
					className={styles.action}>
					<PdfIcon className={styles.icon} />
				</Button>
			</ShadowedContainer>
		</div>
	);
};

export default ExportSelection;
