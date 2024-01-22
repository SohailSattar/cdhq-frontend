import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	CheckBoxSelections,
	Checkbox,
	RadioButton,
	ShadowedContainer,
} from "..";
import { APIExportData, PropertyDisplayNames } from "../../api";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface Props<T> {
	displayNames: PropertyDisplayNames<T>;
	onExcelExport: (data: APIExportData) => void;
}

const ExportSelection = <T extends Record<string, any>>({
	displayNames,
	onExcelExport,
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
			// setProperties((prevState) => [...prevState, ...x]);
			setProperties(x);
		},
		[setProperties]
	);

	console.log(properties);

	const excelExportClickHandler = useMemo(
		() => () => {
			// // Convert the array to a dynamic object
			// const newDynamicObject = properties.reduce((acc, obj) => {
			// 	console.log("acc", acc);
			// 	console.log("obj", obj);
			// 	for (const key in obj) {
			// 		console.log("key", key);
			// 		if (obj.hasOwnProperty(key)) {
			// 			acc[key] = obj[key];
			// 		}
			// 	}
			// 	return acc;
			// }, {});

			const newDynamicObject = properties.reduce((acc, obj) => {
				console.log(obj);
				acc[obj.value] = obj.text;
				return acc;
			}, {});

			console.log(properties);
			console.log(newDynamicObject);

			// Update the state with the new dynamic object
			setDynamicObject(newDynamicObject);

			const params: APIExportData = {
				format: "xls",
				selectedFields: newDynamicObject,
				isPaged: isPaged,
			};

			onExcelExport(params);
		},
		[isPaged, onExcelExport, properties]
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
						label="Select All"
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
					tooltip={t("export.toExcel", {
						framework: "React",
					})}
					className={styles.action}>
					<FontAwesomeIcon icon={faFileExcel} />
				</Button>
				<Button
					tooltip={t("export.toPdf", {
						framework: "React",
					})}
					className={styles.action}>
					<FontAwesomeIcon icon={faFilePdf} />
				</Button>
			</ShadowedContainer>
		</div>
	);
};

export default ExportSelection;
