import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
	IEmployeeProfessionalInfoFormInputs,
	IEmployeeQualificationInfoFormInputs,
} from "../../..";
import {
	Checkbox,
	DatePicker,
	Dropdown,
	ShadowedContainer,
	TextBox,
} from "../../../..";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../utils/store";

import styles from "../../styles.module.scss";
import clsx from "clsx";
import { DropdownOption } from "../../../../Dropdown";
import { Id } from "../../../../../utils";
import { getMoiActJobs } from "../../../../../api/moi/get/getMoiActJobs";
import { getCountries } from "../../../../../api/countries/get/getCountries";
import { getQualifications } from "../../../../../api/qualifications/get/getQualifications";

// Define an interface for dropdown options
interface DropdownOptions {
	countries: DropdownOption[];
	qualifications: DropdownOption[];
}

interface Props {
	canUpdate: boolean;
	// onJobCategorySelect: (option: DropdownOption) => void;
}

const QualificationInfo: FC<Props> = ({ canUpdate }) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const {
		control,
		formState: { errors },
	} = useFormContext<IEmployeeQualificationInfoFormInputs>();

	const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
		countries: [],
		qualifications: [],
	});

	const fetchData = useCallback(async () => {
		try {
			const [countries, qualifications] = await Promise.all([
				getCountries().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getQualifications().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
			]);

			setDropdownOptions({
				countries,
				qualifications,
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [language]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<ShadowedContainer className={styles.basic}>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({
							field: { value, onChange },
						}: {
							field: { value: any; onChange: any };
						}) => (
							<Dropdown
								label={`* ${t("employee.academicQualification", {
									framework: "React",
								})}`}
								options={dropdownOptions.qualifications}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.qualification ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="qualification"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<DatePicker
								date={value}
								onChange={onChange}
								labeltext={t("employee.academicQualificationDate", {
									framework: "React",
								})}
								disabled={!canUpdate}
							/>
						)}
						name="degreeDate"
						control={control}
					/>
				</div>{" "}
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.qualificationName", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="degreeName"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.qualificationCountry", {
									framework: "React",
								})}`}
								options={dropdownOptions.countries}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.degreeCountry ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="degreeCountry"
						control={control}
					/>
				</div>
			</div>{" "}
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.universityName", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="universityName"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default QualificationInfo;
