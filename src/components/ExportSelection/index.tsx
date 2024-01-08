import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Button, CheckBoxSelections, Checkbox, ShadowedContainer } from "..";
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
	const [isSelectAll, setIsSelectAll] = useState<boolean>(true);
	const [properties, setProperties] = useState<string[]>([]);

	const [isPaged, setIsPaged] = useState<boolean>(true);

	const selectAllClickHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const isChecked = event.target.checked;
		setIsSelectAll(isChecked);

		if (isChecked) {
			console.log(displayNames);
			setProperties([]);
		}
	};

	const propertyChangeHandler = useMemo(
		() => (x: string[]) => {
			setProperties(x);
		},
		[]
	);

	const excelExportClickHandler = useMemo(
		() => () => {
			const params: APIExportData = {
				format: "xls",
				selectedFields: properties,
				isPaged: isPaged,
			};
			// onExcelExport(params);
			console.log(properties);

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
			<ShadowedContainer>
				<Button
					onClick={excelExportClickHandler}
					tooltip={t("export.toExcel", {
						framework: "React",
					})}>
					<FontAwesomeIcon icon={faFileExcel} />
				</Button>
				{/* <Button>
						<FontAwesomeIcon icon={faFilePdf} /></Button> */}
			</ShadowedContainer>
		</div>
	);
};

export default ExportSelection;
