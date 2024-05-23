import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IEmployeePersonalInfoFormInputs } from "../../..";
import { DatePicker, Dropdown, ShadowedContainer, TextBox } from "../../../..";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../utils/store";
import { DropdownOption } from "../../../../Dropdown";
import { getBloodTypes } from "../../../../../api/bloodTypes/get/getBloodTypes";
import { getGenders } from "../../../../../api/genders/get/getGenders";
import { getHealthStatuses } from "../../../../../api/healthStatuses/get/getHealthStatuses";
import { getSpecialNeeds } from "../../../../../api/specialNeeds/get/getSpecialNeeds";
import { getMaritalStatuses } from "../../../../../api/maritalStatus/get/getMaritalStatuses";
import { getReligions } from "../../../../../api/religions/get/getReligions";

import styles from "../../styles.module.scss";

// Define an interface for dropdown options
interface DropdownOptions {
	genders: DropdownOption[];
	maritalStatuses: DropdownOption[];
	religions: DropdownOption[];
	specialNeeds: DropdownOption[];
	healthStatuses: DropdownOption[];
	bloodTypes: DropdownOption[];
}

interface Props {
	canUpdate: boolean;
}

const PersonalInfo: FC<Props> = ({ canUpdate }) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<IEmployeePersonalInfoFormInputs>();

	const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
		genders: [],
		maritalStatuses: [],
		religions: [],
		specialNeeds: [],
		healthStatuses: [],
		bloodTypes: [],
	});

	const fetchData = useCallback(async () => {
		try {
			const [
				genders,
				maritalStatuses,
				religions,
				specialNeeds,
				healthStatuses,
				bloodTypes,
			] = await Promise.all([
				getGenders().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMaritalStatuses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getReligions().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getSpecialNeeds().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getHealthStatuses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getBloodTypes().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
			]);

			setDropdownOptions({
				genders,
				maritalStatuses,
				religions,
				specialNeeds,
				healthStatuses,
				bloodTypes,
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
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.gender", {
									framework: "React",
								})}`}
								options={dropdownOptions.genders}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.gender ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="gender"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.maritalStatus", {
									framework: "React",
								})}`}
								options={dropdownOptions.maritalStatuses}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.maritalStatus ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="maritalStatus"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.religion", {
									framework: "React",
								})}`}
								options={dropdownOptions.religions}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.religion ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="religion"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<DatePicker
								date={value}
								onChange={onChange}
								labeltext={`* ${t("employee.dob", {
									framework: "React",
								})}`}
								disabled={!canUpdate}
								className={errors.birthDate ? styles.dateErrorBorder : ""}
							/>
						)}
						name="birthDate"
						control={control}
						defaultValue={new Date().toISOString()}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.birthPlace", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="birthPlace"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.specialNeeds", {
									framework: "React",
								})}`}
								options={dropdownOptions.specialNeeds}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.specialNeed ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="specialNeed"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.healthStatus", {
									framework: "React",
								})}`}
								options={dropdownOptions.healthStatuses}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.healthStatus ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="healthStatus"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.passportNo", {
									framework: "React",
								})}
								value={value || ""}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="passportNo"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.familyBook", {
									framework: "React",
								})}
								value={value || ""}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="familyBookNo"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.eid", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={errors.emiratesIdNo ? styles.errorBorder : ""}
							/>
						)}
						name="emiratesIdNo"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.uid", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={errors.uidNo ? styles.errorBorder : ""}
							/>
						)}
						name="uidNo"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.districtNo", {
									framework: "React",
								})}
								value={value || ""}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="districtNo"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.districtName", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="districtName"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<DatePicker
								date={value}
								onChange={onChange}
								labeltext={t("employee.lastMedTestDate", {
									framework: "React",
								})}
								disabled={!canUpdate}
							/>
						)}
						name="lastMedicalTestDate"
						control={control}
						defaultValue={new Date().toISOString()}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.bloodType", {
									framework: "React",
								})}`}
								options={dropdownOptions.bloodTypes}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.bloodType ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="bloodType"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.height", {
									framework: "React",
								})}
								value={value || ""}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="height"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.weight", {
									framework: "React",
								})}
								value={value || ""}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="weight"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.notes", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="notes"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default PersonalInfo;
