import { ErrorMessage } from "@hookform/error-message";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash/fp";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Dropdown, ShadowedContainer } from "../..";
import { getActiveStatusWithoutInactive } from "../../../api/activeStatus/get/getActiveStatusWithoutInactive";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";
import { APIDepartmentItem } from "../../../api/departments/types";
import { getPrivileges } from "../../../api/privileges/get/getPrivileges";
import { APIPrivilege } from "../../../api/privileges/type";
import { getProjectsList } from "../../../api/projects/get/getProjectsList";
import { APIProjectItem } from "../../../api/projects/types";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";

import { IUserProjectFormInputs } from "../types";
import { APIUserProjectDetail } from "../../../api/userProjects/types";
import { DepartmentCategory } from "../../../data/departmentCategory";

import styles from "./styles.module.scss";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";
import { Id, ROLE } from "../../../utils";
import { getCentersByDepartment } from "../../../api/departments/get/getCentersByDepartment";
import { Project } from "../../../data/projects";

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
	const { role } = useStore((state) => state.loggedInUser);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IUserProjectFormInputs>({ criteriaMode: "all" });

	const [projectOptions, setProjectOptions] = useState<DropdownOption[]>([]);
	const [deptCode, setDeptCode] = useState<string>("");

	const [privilegeOptions, setPrivilegeOptions] = useState<DropdownOption[]>(
		[]
	);

	const [disableWorkflow, setDisableWorkflow] = useState(false);
	const [workflowRangeOptions, setWorkflowRangeOptions] = useState<
		DropdownOption[]
	>([]);
	const [departmentsOptions, setDepartmentsOptions] = useState<
		DropdownOption[]
	>([]);

	const [showCenterOptions, setShowCenterOptions] = useState<boolean>(false);
	const [centersOptions, setCentersOptions] = useState<DropdownOption[]>([]);

	const [hideCanGrant, setHideCanGrant] = useState<boolean>(false);

	// Project
	useEffect(() => {
		const fetchData = async () => {
			const { data: list } = await getProjectsList();
			if (list) {
				setProjectOptions(
					(prevState) =>
						(prevState = list?.map((project: APIProjectItem) => {
							const name =
								language !== "ar" ? project.name : project.nameEnglish;

							return {
								label: name,
								value: project.id,
								meta: {
									hasWorkflow: project.hasWorkflow!,
									departmentSelectionType:
										project.departmentCategory?.code! || "W",
								},
							};
						}))
				);

				const selectedOption = getValues("project");

				if (selectedOption) {
					const selected = list.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.name! : selected?.nameEnglish!;

					setValue("project", {
						label: label,
						value: selected?.id,
						meta: {
							hasWorkflow: selected.hasWorkflow!,
							departmentSelectionType: selected.departmentCategory?.code!,
						},
					});

					fetchDepartments(selected?.id, selected.departmentCategory?.code!);
				}
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

				const selectedOption = getValues("privilege");

				if (selectedOption) {
					const selected = data.find(
						(x) => x.sequenceNumber === selectedOption.value!
					)!;

					const label =
						language !== "ar" ? selected?.name! : selected?.nameEnglish!;

					setValue("privilege", {
						label: label,
						value: selected?.sequenceNumber,
					});
				}
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

				// Workflow Start
				let selectedOption = getValues("workflowStart");

				if (selectedOption) {
					const selected = data.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!;

					setValue("workflowStart", {
						label: label,
						value: selected?.id,
					});
				}

				// Workflow End
				selectedOption = getValues("workflowEnd");

				if (selectedOption) {
					const selected = data.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!;

					setValue("workflowEnd", {
						label: label,
						value: selected?.id,
					});
				}
			}
		};

		fetchData();
	}, [setWorkflowRangeOptions, language]);

	//Department
	const fetchDepartments = useMemo(
		() => async (id: Id, deptCode: string) => {
			const { data } = await getDepartmentsByProject(id);

			if (data) {
				setDepartmentsOptions(
					data.map((dept: APIDepartmentItem) => {
						return {
							label:
								deptCode === "W"
									? language !== "ar"
										? dept.longFullName
										: dept.longFullNameEnglish
									: language !== "ar"
									? dept.name
									: dept.nameEnglish,
							value: dept.id,
						};
					})
				);

				const selectedOption = getValues("department");
				if (selectedOption?.value! != "" && selectedOption) {
					const selected = data.find((x) => x.id === selectedOption?.value!)!;

					const label =
						deptCode === "W"
							? language !== "ar"
								? selected.longFullName
								: selected.longFullNameEnglish
							: language !== "ar"
							? selected.name
							: selected.nameEnglish;
					const value = selected?.id;

					setValue("department", {
						label: label,
						value: value,
					});
				}
			}
		},
		[setDepartmentsOptions, language, deptCode]
	);

	// Structure Type
	const departmentTypeOptions = useMemo(() => {
		return [
			{ value: "9", label: t("project.withChild", { framework: "React" }) },
			{ value: "1", label: t("project.withoutChild", { framework: "React" }) },
		];
	}, [t]);

	useEffect(() => {
		const selectedOption = getValues("structureType");

		if (selectedOption) {
			const selected = departmentTypeOptions.find(
				(x) => x.value === selectedOption.value!
			)!;

			setValue("structureType", {
				label: selected?.label,
				value: selected?.value,
			});
		}
	}, [language]);

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

		setValue("structureType", departmentTypeOptions[0]);
		if (data) {
			const {
				project,
				privilege,
				workflowStartFrom,
				workflowEndTo,
				department,
				departmentStructureType,
				canGrant,
			} = data;

			// Project
			const selectedProject = projectOptions.find(
				(x) => x.value === project.id
			);

			fetchDepartments(project.id, project.departmentCategory?.code);

			setValue("project", selectedProject!);
			if (role == ROLE.ADMIN) {
				if (selectedProject?.value! === Project.UserManagement) {
					setHideCanGrant(true);
				} else {
					setHideCanGrant(false);
				}
			}

			// Privilege
			const selectedPrivilege = privilegeOptions.find(
				(x) => x.value === privilege?.sequenceNumber!
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
				(x) => x.value === workflowStartFrom?.id!
			);
			setValue("workflowStart", selectedWorkflowStart!);

			const selectedWorkflowEnd = workflowRangeOptions.find(
				(x) => x.value === workflowEndTo?.id!
			);
			setValue("workflowEnd", selectedWorkflowEnd!);

			const selectedStructureType = departmentTypeOptions.find(
				(x) => x.value === departmentStructureType.toString()
			);
			setValue("structureType", selectedStructureType!);

			setValue("canGrant", canGrant);
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
		// departmentTypeOptions,
		// departmentsOptions,
		// disableWorkflow,
		// privilegeOptions,
		// projectOptions,
		// register,
		// setValue,
		// workflowRangeOptions,
		language,
	]);

	useEffect(() => {
		const fetch = async () => {
			if (data) {
				const { project, department } = data;

				//

				if (project.departmentCategory.code === DepartmentCategory.Center) {
					setShowCenterOptions(true);
					const centerPrefix = data.department.id.toString().substring(0, 3);

					const mainDepartment = departmentsOptions.find((x) =>
						x.value.toString().startsWith(centerPrefix)
					);

					setValue("department", mainDepartment!);

					//////////////////////////////////////////////////////

					const { data: centersList } = await getCentersByDepartment(
						data.department.id
					);

					setCentersOptions(
						centersList!.map((dept: APIDepartmentItem) => {
							return {
								label: language !== "ar" ? dept.name : dept.nameEnglish,
								value: dept.id,
							};
						})
					);

					const currentCenter = centersOptions.find(
						(x) => x.value === data.department.id
					);

					setValue("center", currentCenter!);
				} else {
					const selectedDepartment = departmentsOptions.find(
						(x) => x.value === department.id
					);

					setValue("department", selectedDepartment!);
				}
			}
		};

		fetch();
	}, [data, departmentsOptions]);

	useEffect(() => {
		if (showCenterOptions) {
			// Department Structure Type
			register("center", {
				required: "Center is required.",
			});
		}
	}, [register, setValue, language, showCenterOptions]);

	useEffect(() => {
		const fetch = async () => {
			if (data) {
				const { project } = data!;

				// fetchDepartments(project.id);

				if (project.departmentCategory.code === DepartmentCategory.Center) {
					setShowCenterOptions(true);

					const centerPrefix = data.department.id.toString().substring(0, 3);

					const mainDepartment = departmentsOptions.find((x) =>
						x.value.toString().startsWith(centerPrefix)
					);

					setValue("department", mainDepartment!);

					const { data: centersList } = await getCentersByDepartment(
						data.department.id
					);

					setCentersOptions(
						centersList!.map((dept: APIDepartmentItem) => {
							return {
								label: language !== "ar" ? dept.name : dept.nameEnglish,
								value: dept.id,
							};
						})
					);

					const currentCenter = centersOptions.find(
						(x) => x.value === data.department.id
					);

					setValue("center", currentCenter!);
				}
			}
		};

		// fetch();
	}, [
		data,
		setCentersOptions,
		setDepartmentsOptions,
		// centersOptions,
		// departmentsOptions,
	]);

	const projectSelectHandler = (option: DropdownOption) => {
		setShowCenterOptions(false);
		setDepartmentsOptions([]);
		if (option?.meta!.hasWorkflow! === false) {
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

		if (role === ROLE.SUPERADMIN) {
			if (option?.value! === Project.UserManagement) {
				setHideCanGrant(true);
			} else {
				setHideCanGrant(false);
			}
		}

		setValue("project", option);

		setValue("department", { label: "", value: "", meta: null });

		if (option?.value) {
			fetchDepartments(option?.value, option?.meta.departmentSelectionType);
		}

		setCentersOptions([]);

		if (option?.meta.departmentSelectionType === DepartmentCategory.Center) {
			setShowCenterOptions(true);
		} else {
			setShowCenterOptions(false);
		}
	};

	const departmentSelectHandler = async (option: DropdownOption) => {
		setCentersOptions([]);
		setValue("center", { label: "", value: "", meta: null });
		setValue("department", option);

		if (showCenterOptions) {
			const { data } = await getCentersByDepartment(option.value);

			setCentersOptions(
				data!.map((dept: APIDepartmentItem) => {
					return {
						label: language !== "ar" ? dept.name : dept.nameEnglish,
						value: dept.id,
					};
				})
			);
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
								render={({ field: { value } }) => (
									<Dropdown
										label={t("department.name", { framework: "React" })}
										options={departmentsOptions}
										onSelect={departmentSelectHandler}
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
						{showCenterOptions && (
							<div className={styles.rowItem}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<Dropdown
											label={t("department.center", { framework: "React" })}
											options={centersOptions}
											onSelect={onChange}
											value={value}
											// disabled={isExistingEmployee}
											// disabled={disableField}
										/>
									)}
									name="center"
									control={control}
									// rules={{ required: true }}
								/>
							</div>
						)}
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
						{!isNormalUser && !hideCanGrant && (
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
												<p
													key={type}
													className="error">
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
												<p
													key={type}
													className="error">
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
												<p
													key={type}
													className="error">
													{message}
												</p>
										  ))
										: null;
								}}
							/>
							<ErrorMessage
								errors={errors}
								name="center"
								render={({ messages }) => {
									return messages
										? _.entries(messages).map(([type, message]) => (
												<p
													key={type}
													className="error">
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
												<p
													key={type}
													className="error">
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
												<p
													key={type}
													className="error">
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
												<p
													key={type}
													className="error">
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
