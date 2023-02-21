import { ErrorMessage } from "@hookform/error-message";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash/fp";
import { useTranslation } from "react-i18next";
import {
	Button,
	Checkbox,
	Dropdown,
	RadioButton,
	ShadowedContainer,
} from "../..";
import { getActiveStatusWithoutInactive } from "../../../api/activeStatus/get/getActiveStatusWithoutInactive";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";
import {
	APICategorizedDepartment,
	APIDepartmentItem,
} from "../../../api/departments/types";
import { getPrivileges } from "../../../api/privileges/get/getPrivileges";
import { APIPrivilege } from "../../../api/privileges/type";
import { getProjectsList } from "../../../api/projects/get/getProjectsList";
import { APIProjectItem } from "../../../api/projects/types";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";

import { IUserProjectFormInputs } from "../types";
import styles from "./styles.module.scss";
import { APIUserProjectDetail } from "../../../api/userProjects/types";
import { getMainDepartments } from "../../../api/departments/get/getMainDepartments";

interface Props {
	isNormalUser?: boolean;
	title?: string;
	disableProject?: boolean;
	data?: APIUserProjectDetail;
	actionButtonText: string;
	onActionButtonClick: (data: IUserProjectFormInputs) => void;
}

const UserProjectForm: FC<Props> = ({
	isNormalUser,
	title,
	disableProject = false,
	data,
	actionButtonText,
	onActionButtonClick,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const {
		register,
		formState: { errors },
		handleSubmit,
		getValues,
		setValue,
		control,
	} = useForm<IUserProjectFormInputs>({ criteriaMode: "all" });

	const [projectOptions, setProjectOptions] = useState<DropdownOption[]>([]);

	const [privilegeOptions, setPrivilegeOptions] = useState<DropdownOption[]>(
		[]
	);
	const [isPrivilegeDisabled, setIsPrivilegeDisabled] = useState(true);

	const [disableWorkflow, setDisableWorkflow] = useState(false);
	const [workflowRangeOptions, setWorkflowRangeOptions] = useState<
		DropdownOption[]
	>([]);
	const [departmentsOptions, setDepartmentsOptions] = useState<
		DropdownOption[]
	>([]);

	// Project
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getProjectsList();

			if (data) {
				setProjectOptions(
					(prevState) =>
						(prevState = data?.map((project: APIProjectItem) => {
							const name =
								language !== "ar" ? project.name : project.nameEnglish;

							return {
								label: name,
								value: project.id,
								meta: {
									hasWorkflow: project.hasWorkflow!,
									departmentSelectionType: project.departmentSelectionType!,
								},
							};
						}))
				);
			}
		};

		fetchData();
	}, [language]);

	// Privilege
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getPrivileges();

			if (data) {
				setPrivilegeOptions(
					data?.map((privilege: APIPrivilege) => {
						const name =
							language !== "ar" ? privilege.name : privilege.nameEnglish;
						return {
							label: name,
							value: privilege.sequenceNumber,
						};
					})
				);
			}
		};

		fetchData();
	}, [language]);

	// Workflow
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getActiveStatusWithoutInactive();

			if (data) {
				setWorkflowRangeOptions(
					data?.map((status: APIActiveStatus) => {
						const name =
							language !== "ar" ? status.nameArabic : status.nameEnglish;
						return {
							label: name,
							value: status.id,
						};
					})
				);
			}
		};

		fetchData();
	}, [language]);

	//Department
	const fetchMainDepartments = useMemo(
		() => async () => {
			const { data } = await getMainDepartments();

			if (data) {
				setDepartmentsOptions(
					data.map((dept: APIDepartmentItem) => {
						return { label: dept.name, value: dept.id };
					})
				);
			}
		},
		[setDepartmentsOptions]
	);

	const fetchCategorizedDepartments = useMemo(
		() => async () => {
			const { data } = await getCategorizedDepartments();

			if (data) {
				setDepartmentsOptions(
					data.map((dept: APICategorizedDepartment) => {
						return { label: dept.longFullName, value: dept.id };
					})
				);
			}
		},
		[setDepartmentsOptions]
	);

	useEffect(() => {
		// const { departmentSelectionType } = data?.project!;

		console.log(data?.project!.departmentSelectionType!);

		if (data?.project?.departmentSelectionType! === "M") {
			fetchMainDepartments();
		} else if (data?.project?.departmentSelectionType! === "C") {
			fetchCategorizedDepartments();
		}

		// const fetchData = async () => {
		// 	const { data } = await getCategorizedDepartments();
		// 	if (data) {
		// 		setDepartmentsOptions(
		// 			data.map((dept: APICategorizedDepartment) => {
		// 				return { label: dept.longFullName, value: dept.id };
		// 			})
		// 		);
		// 	}
		// };
		// fetchData();
		// if(selectedPor)
	}, [data?.project?.departmentSelectionType]);

	// Structure Type
	const departmentTypeOptions = useMemo(() => {
		return [
			{ value: "9", label: t("project.withChild", { framework: "React" }) },
			{ value: "1", label: t("project.withoutChild", { framework: "React" }) },
		];
	}, [t]);

	useEffect(() => {
		// Project
		register("project", {
			required: "Project is required.",
		});

		// Privilege
		register("privilege", {
			required: "Privilege is required.",
		});

		// Workflow
		register("workflowStart", {
			required: "Workflow starts from is required.",
		});

		register("workflowEnd", {
			required: "Workflow ends at is required.",
		});

		// Department
		register("department", {
			required: "Department is required.",
		});

		// Department Structure Type
		register("structureType", {
			required: "Structure type is required.",
		});

		if (data) {
			const {
				project,
				privilege,
				workflowStartFrom,
				workflowEndTo,
				department,
				departmentStructureType,
			} = data;

			// Project
			const selectedProject = projectOptions.find(
				(x) => x.value === project.id
			);
			setValue("project", selectedProject!);

			// Privilege
			const selectedPrivilege = privilegeOptions.find(
				(x) => x.value === privilege.sequenceNumber
			);
			setValue("privilege", selectedPrivilege!);

			// Workflow
			if (project.hasWorkflow === false) {
				setDisableWorkflow(true);
			} else {
				if (disableWorkflow === true) {
					setDisableWorkflow(false);
				}
			}

			const selectedWorkflowStart = workflowRangeOptions.find(
				(x) => x.value === workflowStartFrom.id
			);
			setValue("workflowStart", selectedWorkflowStart!);

			const selectedWorkflowEnd = workflowRangeOptions.find(
				(x) => x.value === workflowEndTo.id
			);
			setValue("workflowEnd", selectedWorkflowEnd!);

			const selectedDepartment = departmentsOptions.find(
				(x) => x.value === department.id
			);
			setValue("department", selectedDepartment!);

			const selectedStructureType = departmentTypeOptions.find(
				(x) => x.value === departmentStructureType.toString()
			);
			setValue("structureType", selectedStructureType!);
		}

		// if (selectedProjectOption) {
		// 	const { meta: hasHierarchy } = selectedProjectOption!; //.meta!;

		// 	if (hasHierarchy === false) {
		// 		setDisableWorkflow(true);
		// 	} else {
		// 		setDisableWorkflow(false);
		// 	}

		// 	setIsPrivilegeDisabled(false);
		// }
	}, [
		data,
		departmentTypeOptions,
		departmentsOptions,
		disableWorkflow,
		privilegeOptions,
		projectOptions,
		register,
		setValue,
		workflowRangeOptions,
	]);

	const projectSelectHandler = (option: DropdownOption) => {
		if (option.meta.hasWorflow === false) {
			setDisableWorkflow(true);
			setValue(
				"workflowStart",
				workflowRangeOptions.find((x) => x.value === 7)!
			);

			setValue("workflowEnd", workflowRangeOptions.find((x) => x.value === 1)!);
		} else {
			if (disableWorkflow === true) {
				setDisableWorkflow(false);
			}
		}

		setIsPrivilegeDisabled(false);

		setValue("project", option);

		if (option.meta.departmentSelectionType === "M") {
			fetchMainDepartments();
		} else {
			fetchCategorizedDepartments();
		}
	};

	const submitHandler = (values: IUserProjectFormInputs) => {
		onActionButtonClick(values);
	};

	return (
		<div className={styles.assignProject}>
			{title && (
				<div>
					<h4>{title}</h4>
				</div>
			)}
			<ShadowedContainer>
				<form onSubmit={handleSubmit(submitHandler)}>
					<div className={styles.row}>
						<div className={styles.rowItem}>
							<Controller
								render={({ field: { value } }) => (
									<Dropdown
										label={t("project.name", { framework: "React" })}
										options={projectOptions}
										onSelect={projectSelectHandler}
										value={value}
										disabled={disableProject}
									/>
								)}
								name="project"
								control={control}
								// rules={{ required: true }}
							/>
						</div>
						<div className={styles.rowItem}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("privilege.name", { framework: "React" })}
										options={privilegeOptions}
										onSelect={onChange}
										value={value}
										// disabled={isExistingEmployee}
										// disabled={disableField}
									/>
								)}
								name="privilege"
								control={control}
								// rules={{ required: true }}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.rowItem}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("userProject.workflowStart", {
											framework: "React",
										})}
										options={workflowRangeOptions}
										onSelect={onChange}
										value={value}
										disabled={disableWorkflow}
									/>
								)}
								name="workflowStart"
								control={control}
								// rules={{ required: true }}
							/>
						</div>
						<div className={styles.rowItem}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("userProject.workflowEnd", { framework: "React" })}
										options={workflowRangeOptions}
										onSelect={onChange}
										value={value}
										disabled={disableWorkflow}
									/>
								)}
								name="workflowEnd"
								control={control}
								// rules={{ required: true }}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.rowItem}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("department.name", { framework: "React" })}
										options={departmentsOptions}
										onSelect={onChange}
										value={value}
										// disabled={isExistingEmployee}
										// disabled={disableField}
									/>
								)}
								name="department"
								control={control}
								// rules={{ required: true }}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.rowItem}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("userProject.withOrWithoutSubSection", {
											framework: "React",
										})}
										options={departmentTypeOptions}
										onSelect={onChange}
										value={value}
										// disabled={isExistingEmployee}
										// disabled={disableField}
									/>
								)}
								name="structureType"
								control={control}
								// rules={{ required: true }}
							/>
						</div>
						{!isNormalUser && (
							<div className={styles.rowItem}>
								<ShadowedContainer>
									<Controller
										render={({ field: { onChange, value } }) => (
											<Checkbox
												label={t("userProject.canGrant", {
													framework: "React",
												})}
												checked={value}
												onChange={onChange}
											/>
										)}
										name="canGrant"
										control={control}
										// rules={{ required: true }}
									/>
									{/* <Checkbox
									label={t('userProject.canGrant', { framework: 'React' })}
									checked={canGrant}
									onChange={checkChangeHandler}
								/> */}
								</ShadowedContainer>
							</div>
						)}
					</div>

					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
							<ErrorMessage
								errors={errors}
								name="project"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p key={type} className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="privilege"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p key={type} className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="department"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p key={type} className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="workflowStart"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p key={type} className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="workflowEnd"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p key={type} className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>

							<ErrorMessage
								errors={errors}
								name="structureType"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p key={type} className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
						</ShadowedContainer>
					)}
					<div className={styles.row}>
						<div className={styles.rowItem}>
							<ShadowedContainer>
								<Button type="submit">{actionButtonText}</Button>
							</ShadowedContainer>
						</div>
					</div>
				</form>
			</ShadowedContainer>
		</div>
	);
};

export default UserProjectForm;
