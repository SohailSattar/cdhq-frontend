import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
	IEmployeeOfficialInfoFormInputs,
	IEmployeePersonalInfoFormInputs,
} from "../../..";
import { DatePicker, Dropdown, ShadowedContainer, TextBox } from "../../../..";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../utils/store";

import styles from "../../styles.module.scss";
import clsx from "clsx";
import { DropdownOption } from "../../../../Dropdown";
import { getClasses } from "../../../../../api/classes/get/getClasses";
import { getRanks } from "../../../../../api/ranks/get/getRanks";
import { getContractTypes } from "../../../../../api/contractType/get/getContractTypes";
import { getProfessions } from "../../../../../api/professions/get/getProfessions";
import { getCountries } from "../../../../../api/countries/get/getCountries";
import { getNationalServices } from "../../../../../api/nationalServices/get/getNationalServices";
import { getEmployeeStatuses } from "../../../../../api/employees/get/getEmployeeStatuses";

interface DropdownOptions {
	classes: DropdownOption[];
	ranks: DropdownOption[];
	contractTypes: DropdownOption[];
	professions: DropdownOption[];
	countries: DropdownOption[];
	nationalServices: DropdownOption[];
	statuses: DropdownOption[];
}

interface Props {
	canUpdate: boolean;
}

const OfficialInfo: FC<Props> = ({ canUpdate }) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
		classes: [],
		ranks: [],
		contractTypes: [],
		professions: [],
		countries: [],
		nationalServices: [],
		statuses: [],
	});

	const fetchData = useCallback(async () => {
		try {
			const [
				classes,
				ranks,
				contractTypes,
				professions,
				countries,
				nationalServices,
				statuses,
			] = await Promise.all([
				getClasses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.logPre} - ${
							language !== "ar" ? item.name : item.nameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
				getRanks().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getContractTypes().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getProfessions().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getCountries().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getNationalServices().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getEmployeeStatuses().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.id} - ${
							language !== "ar" ? item.name : item.nameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
			]);

			setDropdownOptions({
				classes,
				ranks,
				contractTypes,
				professions,
				countries,
				nationalServices,
				statuses,
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [language]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<IEmployeeOfficialInfoFormInputs>();

	return (
		<ShadowedContainer className={clsx(styles.basic)}>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.militaryNo", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								className={clsx(
									styles.txtBox,
									errors.employeeNo ? styles.errorBorder : ""
								)}
								disabled={!canUpdate}
							/>
						)}
						name="employeeNo"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("global.name", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={errors.name ? styles.errorBorder : ""}
							/>
						)}
						name="name"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("global.nameEnglish", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={errors.nameEnglish ? styles.errorBorder : ""}
							/>
						)}
						name="nameEnglish"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("class.name", { framework: "React" })}`}
								options={dropdownOptions.classes}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.class ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="class"
						control={control}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<DatePicker
								date={value}
								onChange={onChange}
								labeltext={t("employee.hireDate", {
									framework: "React",
								})}
								disabled={!canUpdate}
							/>
						)}
						name="hireDate"
						control={control}
						defaultValue={new Date().toISOString()}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<DatePicker
								date={value}
								onChange={onChange}
								labeltext={t("employee.joinDate", {
									framework: "React",
								})}
								disabled={!canUpdate}
							/>
						)}
						name="joinDate"
						control={control}
						defaultValue={new Date().toISOString()}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("rank.name", { framework: "React" })}`}
								options={dropdownOptions.ranks}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.rank ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="rank"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.contractType", {
									framework: "React",
								})}`}
								options={dropdownOptions.contractTypes}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.contractType ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="contractType"
						control={control}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.profession", {
									framework: "React",
								})}`}
								options={dropdownOptions.professions}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.profession ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="profession"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.nationality", {
									framework: "React",
								})}`}
								options={dropdownOptions.countries}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.nationality ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="nationality"
						control={control}
					/>
				</div>{" "}
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.nationalService", {
									framework: "React",
								})}`}
								options={dropdownOptions.nationalServices}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.nationalService ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="nationalService"
						control={control}
					/>
				</div>{" "}
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.nationalServiceGroup", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="nationalServiceGroup"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.status", {
									framework: "React",
								})}`}
								options={dropdownOptions.statuses}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.status ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="status"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.statusDetail", {
									framework: "React",
								})}
								value={value || ""}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="statusDetails"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<DatePicker
								date={value}
								onChange={onChange}
								labeltext={`* ${t("employee.statusDate", {
									framework: "React",
								})}`}
								disabled={!canUpdate}
								className={errors.statusDate ? styles.dateErrorBorder : ""}
							/>
						)}
						name="statusDate"
						control={control}
						defaultValue={new Date().toISOString()}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<DatePicker
								date={value}
								onChange={onChange}
								labeltext={`* ${t("employee.milCardExpDate", {
									framework: "React",
								})}`}
								disabled={!canUpdate}
								className={
									errors.militaryCardExpiryDate ? styles.dateErrorBorder : ""
								}
							/>
						)}
						name="militaryCardExpiryDate"
						control={control}
						defaultValue={new Date().toISOString()}
					/>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default OfficialInfo;
