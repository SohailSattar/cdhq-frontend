import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IEmployeeProfessionalInfoFormInputs } from "../../..";
import { Checkbox, Dropdown, ShadowedContainer, TextBox } from "../../../..";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../utils/store";
import clsx from "clsx";
import { DropdownOption } from "../../../../Dropdown";
import { Id } from "../../../../../utils";
import { getMoiActJobs } from "../../../../../api/moi/get/getMoiActJobs";
import { getMainDepartments } from "../../../../../api/departments/get/getMainDepartments";
import { Project } from "../../../../../data/projects";
import { getCategorizedDepartments } from "../../../../../api/departments/get/getCategorizedDepartments";
import { getProfessionalTrainings } from "../../../../../api/professionalTraining/get/getProfessionalTrainings";
import { getWorkModes } from "../../../../../api/works/get/getWorkModes";
import { getWorkGroups } from "../../../../../api/works/get/getWorkGroups";
import { getSignaturesList } from "../../../../../api/signaturesList/get/getSignaturesList";
import { getMoiJobCategories } from "../../../../../api/moi/get/getMoiJobCategories";
import { getAssignedJobs } from "../../../../../api/assignedJobs/get/getAssignedJobs";
import { getMilitaryTrained } from "../../../../../api/militaryTrained/get/getMilitraryTrained";
import { getMilitaryWear } from "../../../../../api/militaryWear/get/getMilitaryWear";

import styles from "../../styles.module.scss";

// Define an interface for dropdown options
interface DropdownOptions {
	departments: DropdownOption[];
	section: DropdownOption[];
	professionalTraining: DropdownOption[];
	workMode: DropdownOption[];
	workGroup: DropdownOption[];
	signaturesLists: DropdownOption[];
	jobCategoryMoi: DropdownOption[];
	assignedJobs: DropdownOption[];
	militaryTrained: DropdownOption[];
	militaryUniform: DropdownOption[];
}

interface Props {
	canUpdate: boolean;
	mode: "INSERT" | "UPDATE";
}

const ProfessionalInfo: FC<Props> = ({ canUpdate, mode }) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
		departments: [],
		section: [],
		professionalTraining: [],
		workMode: [],
		workGroup: [],
		signaturesLists: [],
		jobCategoryMoi: [],
		assignedJobs: [],
		militaryTrained: [],
		militaryUniform: [],
	});

	const [actJobMoiOptions, setActJobMoiOptions] = useState<DropdownOption[]>(
		[]
	);

	const {
		register,
		control,
		setValue,
		formState: { errors },
	} = useFormContext<IEmployeeProfessionalInfoFormInputs>();

	const fetchData = useCallback(async () => {
		try {
			const [
				departments,
				section,
				professionalTraining,
				workMode,
				workGroup,
				signaturesLists,
				jobCategoryMoi,
				assignedJobs,
				militaryTrained,
				militaryUniform,
			] = await Promise.all([
				getMainDepartments("M1", Project.Employees, mode).then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.id} - ${
							language !== "ar" ? item.name : item.nameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
				getCategorizedDepartments(Project.Employees, mode).then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${item.id} - ${
							language !== "ar" ? item.fullName : item.fullNameEnglish
						}`,
					}))
				) as Promise<DropdownOption[]>,
				getProfessionalTrainings().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getWorkModes().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getWorkGroups().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getSignaturesList().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMoiJobCategories().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getAssignedJobs().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMilitaryTrained().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
				getMilitaryWear().then((response) =>
					response?.data?.map((item) => ({
						value: item.id,
						label: `${language !== "ar" ? item.name : item.nameEnglish}`,
					}))
				) as Promise<DropdownOption[]>,
			]);

			setDropdownOptions({
				departments,
				section,
				professionalTraining,
				workMode,
				workGroup,
				signaturesLists,
				jobCategoryMoi,
				assignedJobs,
				militaryTrained,
				militaryUniform,
			});
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [language, mode]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const fetchActJobMoi = useMemo(
		() => async (categoryId: Id) => {
			const { data: list } = await getMoiActJobs(categoryId);
			if (list) {
				setActJobMoiOptions(
					list?.map((d) => {
						return {
							label: `${language !== "ar" ? d.name : d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		},
		[language]
	);

	// useEffect(() => {
	// 		if (data) {
	// 			const { actJobMOI } = data;
	// 			fetchActJobMoi(actJobMOI.groupId);
	// 		}
	// 	}, [data, fetchActJobMoi]);

	// 	useEffect(() => {
	// 		if (data) {
	// 			const { actJobMOI } = data;
	// 			const selectedActJobMoi = actJobMoiOptions.find(
	// 				(x) => x.value === actJobMOI?.id
	// 			);
	// 			setValue("actJob", selectedActJobMoi!);
	// 		}
	// 	}, [actJobMoiOptions, setValue]);

	const jobCategoryMoiChangeHandler = (option: DropdownOption) => {
		setValue("jobCatMoi", option);
	};

	return (
		<ShadowedContainer className={styles.basic}>
			<div className={styles.row}>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.workplace", {
									framework: "React",
								})}`}
								options={dropdownOptions.departments}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.department ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="department"
						control={control}
					/>
				</div>

				<div className={clsx(styles.field, styles.checkbox)}>
					<Controller
						render={({ field: { onChange, value } }) => (
							<Checkbox
								label={t("employee.isManager", { framework: "React" })}
								checked={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="isWorkLocationManager"
						control={control}
						defaultValue={false}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.workLocation", {
									framework: "React",
								})}`}
								options={dropdownOptions.section}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.section ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="section"
						control={control}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.professionalTraining", {
									framework: "React",
								})}`}
								options={dropdownOptions.professionalTraining}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={
									errors.professionalTraining ? styles.ddlErrorBorder : ""
								}
							/>
						)}
						name="professionalTraining"
						control={control}
					/>
				</div>

				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.workMode", {
									framework: "React",
								})}`}
								options={dropdownOptions.workMode}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.workMode ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="workMode"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.workGroup", {
									framework: "React",
								})}`}
								options={dropdownOptions.workGroup}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.workGroup ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="workGroup"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.signList", {
									framework: "React",
								})}`}
								options={dropdownOptions.signaturesLists}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.signList ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="signList"
						control={control}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={t("employee.jobCatMoi", {
									framework: "React",
								})}
								options={dropdownOptions.jobCategoryMoi}
								onSelect={jobCategoryMoiChangeHandler}
								value={value}
								disabled={!canUpdate}
							/>
						)}
						name="jobCatMoi"
						control={control}
					/>
				</div>

				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.actJob", { framework: "React" })}`}
								options={actJobMoiOptions}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.actJob ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="actJob"
						control={control}
					/>
				</div>
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.assignedJob", {
									framework: "React",
								})}`}
								options={dropdownOptions.assignedJobs}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.assignedJob ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="assignedJob"
						control={control}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.additionalJob", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="additionalJob"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.ddlField}>
					<div className={styles.exp}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("employee.expYear", {
										framework: "React",
									})}
									value={value}
									onChange={onChange}
									disabled={!canUpdate}
								/>
							)}
							name="previousExperienceYear"
							control={control}
							defaultValue={"0"}
						/>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("employee.expMonth", {
										framework: "React",
									})}
									value={value}
									onChange={onChange}
									disabled={!canUpdate}
								/>
							)}
							name="previousExperienceMonth"
							control={control}
							defaultValue={"0"}
						/>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("employee.expDay", {
										framework: "React",
									})}
									value={value}
									onChange={onChange}
									disabled={!canUpdate}
								/>
							)}
							name="previousExperienceDay"
							control={control}
							defaultValue={"0"}
						/>
					</div>
				</div>{" "}
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.militaryTrained", {
									framework: "React",
								})}`}
								options={dropdownOptions.militaryTrained}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.militaryTrained ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="militaryTrained"
						control={control}
					/>
				</div>{" "}
				<div className={styles.ddlField}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<Dropdown
								label={`* ${t("employee.militaryUniform", {
									framework: "React",
								})}`}
								options={dropdownOptions.militaryUniform}
								onSelect={onChange}
								value={value}
								disabled={!canUpdate}
								className={errors.militaryWear ? styles.ddlErrorBorder : ""}
							/>
						)}
						name="militaryWear"
						control={control}
					/>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default ProfessionalInfo;
