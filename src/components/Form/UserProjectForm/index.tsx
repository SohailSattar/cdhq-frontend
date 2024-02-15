import { ErrorMessage } from "@hookform/error-message";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash/fp";
import { useTranslation } from "react-i18next";
import {
	Button,
	Checkbox,
	DeleteConfirmation,
	Dropdown,
	ShadowedContainer,
} from "../..";
import { getActiveStatusWithoutInactive } from "../../../api/activeStatus/get/getActiveStatusWithoutInactive";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { APIDepartmentItem } from "../../../api/departments/types";
import { getPrivileges } from "../../../api/privileges/get/getPrivileges";
import { APIPrivilege } from "../../../api/privileges/type";
import { getProjectsList } from "../../../api/projects/get/getProjectsList";
import { APIProjectItem } from "../../../api/projects/types";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";

import { IUserProjectFormInputs } from "../types";
import { APIUserProjectDetail } from "../../../api/userProjects/types";

import styles from "./styles.module.scss";
import { getDepartmentsByProject } from "../../../api/departments/get/getDepartmentsByProject";
import { Id, ROLE } from "../../../utils";
import { Project } from "../../../data/projects";
import { getUserProjectByDepartment } from "../../../api/userProjects/get/getUserProjectByDepartment";
import { getPrivilegesByType } from "../../../api/privileges/get/getPrivilegesByType";
import { getUserProject } from "../../../api/userProjects/get/getUserProject";
import { getPrivilegeId } from "../../../api/privileges/get/getPrivilegeId";
import { getAllWorkflowStatus } from "../../../api/activeStatus/get/getAllWorkflowStatus";

interface Props {
	id?: Id;
	isNormalUser?: boolean;
	title?: string;
	disableProject?: boolean;
	detail?: APIUserProjectDetail;

	actionButtonText: string;
	onActionButtonClick: (data: IUserProjectFormInputs) => void;
	onDelete?: () => void;
}

const UserProjectForm: FC<Props> = ({
	id,
	isNormalUser,
	title,
	disableProject = false,
	detail,
	actionButtonText,
	onActionButtonClick,
	onDelete = () => {},
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const { role } = useStore((state) => state.loggedInUser);

	const [showModal, setShowModal] = useState(false);
	const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);

	const [data, setData] = useState<APIUserProjectDetail>();

	useEffect(() => {
		// setData(detail!);
		const fetch = async () => {
			if (id) {
				const { data } = await getUserProject(id!);
				setData(data);
			}
		};

		fetch();
	}, [id, setData]);

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

	const [projectsList, setProjectsList] = useState<APIProjectItem[]>([]);
	const [departmentsList, setDepartmentsList] = useState<APIDepartmentItem[]>(
		[]
	);
	const [priviligesList, setPrivilegesList] = useState<APIPrivilege[]>([]);
	const [workflowList, setWorkflowList] = useState<APIActiveStatus[]>([]);

	const [hideCanGrant, setHideCanGrant] = useState<boolean>(false);

	//Department
	const fetchDepartments = useMemo(
		() => async (id: Id) => {
			const { data } = await getDepartmentsByProject(id);
			if (data) {
				setDepartmentsList(data);

				setDepartmentsOptions((prevState) =>
					data.map((dept: APIDepartmentItem) => {
						return {
							label:
								language !== "ar"
									? dept.id + " - " + dept.fullName
									: dept.id + " - " + dept.fullNameEnglish,
							value: dept.id,
						};
					})
				);
				const selectedOption = getValues("department");
				if (selectedOption?.value! !== "" && selectedOption) {
					const selected = data.find((x) => x.id === selectedOption?.value!)!;

					if (selected) {
						const label =
							language !== "ar" ? selected.fullName : selected.fullNameEnglish;
						const value = selected?.id;

						setValue("department", {
							label: `${value} - ${label}`,
							value: value,
						});

						// // Centers
						// if (showCenterOptions) {
						// 	fetchCenters(selected.id);
						// }
					} else {
						setValue("department", null!);
					}
				}
			}
		},
		[getValues, language, setValue]
	);

	const fetchProjects = useMemo(
		() => async () => {
			const { data: list } = await getProjectsList();

			if (list) {
				setProjectsList(list);

				setProjectOptions(
					list?.map((project: APIProjectItem) => {
						const name = language !== "ar" ? project.name : project.nameEnglish;

						return {
							label: `${project.id}`.concat(" - ", name),
							value: project.id,
							meta: {
								hasWorkflow: project.hasWorkflow!,
								departmentSelectionType:
									project.departmentCategory?.code! || "W",
							},
						};
					})
				);

				const selectedOption = getValues("project");

				if (selectedOption) {
					const selected = list.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.name! : selected?.nameEnglish!;

					setValue("project", {
						label: `${selected?.id} - ${label}`,
						value: selected?.id,
						meta: {
							hasWorkflow: selected.hasWorkflow!,
							departmentSelectionType: selected.departmentCategory?.code!,
						},
					});

					fetchDepartments(selected?.id);
				}
			}
		},
		[getValues, language, setValue]
	);

	useEffect(() => {
		const fetchData = async () => {
			const { data: list } = await getProjectsList();

			if (list) {
				setProjectOptions(
					list?.map((project: APIProjectItem) => {
						const name =
							language !== "ar" ? project?.name : project?.nameEnglish;

						return {
							label: `${project.id}`.concat(" - ", name),
							value: project.id,
							meta: {
								hasWorkflow: project.hasWorkflow!,
								departmentSelectionType:
									project.departmentCategory?.code! || "W",
							},
						};
					})
				);

				const selectedOption = getValues("project");

				if (selectedOption) {
					const selected = list.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.name! : selected?.nameEnglish!;

					setValue("project", {
						label: `${selected?.id} - ${label}`,
						value: selected?.id,
						meta: {
							hasWorkflow: selected.hasWorkflow!,
							departmentSelectionType: selected.departmentCategory?.code!,
						},
					});

					fetchDepartments(selected?.id);
				}
			}
		};

		fetchData();
	}, [fetchDepartments, getValues, language, setProjectOptions, setValue]);

	// Privilege
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getPrivileges();

			if (data) {
				setPrivilegesList(data);

				setPrivilegeOptions(
					data?.map((privilege: APIPrivilege) => {
						const name = `${privilege.sequenceNumber} - ${
							language !== "ar" ? privilege.name : privilege?.nameEnglish
						}`;
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

					const label = `${selected.sequenceNumber} - ${
						language !== "ar" ? selected.name : selected?.nameEnglish
					}`;

					setValue("privilege", {
						label: label,
						value: selected?.sequenceNumber,
					});
				}
			}
		};

		fetchData();
	}, [getValues, language, setValue]);

	// Workflow
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getActiveStatusWithoutInactive();
			if (data) {
				setWorkflowList(data);

				//get currently selected project
				const selectedProject = getValues("project.value");

				// if (role === ROLE.SUPERADMIN) {
				setWorkflowRangeOptions(
					data?.map((status: APIActiveStatus) => {
						const name = `${status.id} - ${
							language !== "ar" ? status.nameArabic : status?.nameEnglish
						}`;
						return {
							label: name,
							value: status.id,
						};
					})
					// .sort((a, b) => +b.value - +a.value)
				);
				// }

				// Workflow Start
				let selectedOption = getValues("workflowStart");

				if (selectedOption) {
					const selected = data.find((x) => x.id === selectedOption.value!)!;

					const label = `${selected?.id!} - ${
						language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!
					}`;

					setValue("workflowStart", {
						label: label,
						value: selected?.id,
					});
				} else {
					if (selectedProject) {
						const selected = data.find((x) => x.id === 7)!;

						const label = `${selected.id} - ${
							language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!
						}`;

						setValue("workflowStart", {
							label: label,
							value: selected?.id,
						});
					}
				}

				// Workflow End
				selectedOption = getValues("workflowEnd");

				if (selectedOption) {
					const selected = data.find((x) => x.id === selectedOption.value!)!;

					const label = `${selected.id} - ${
						language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!
					}`;

					setValue("workflowEnd", {
						label: label,
						value: selected?.id,
					});
				} else {
					if (selectedProject) {
						const selected = data.find((x) => x.id === 1)!;

						const label = `${selected.id} - ${
							language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!
						}`;

						setValue("workflowEnd", {
							label: label,
							value: selected?.id,
						});
					}
				}
			}
		};

		fetchData();
	}, [setWorkflowRangeOptions, language, role, getValues, setValue]);

	// Privileges
	const fetchPrivileges = useMemo(
		() => async (id: Id) => {
			const { data } = await getPrivilegesByType(id);
			if (data) {
				setPrivilegeOptions(
					data.map((x) => {
						const label = `${x.sequenceNumber} - ${
							language !== "ar" ? x.name : x.nameEnglish
						}`;
						const value = x.sequenceNumber;
						return { label: label, value: value };
					})
				);

				const selectedOption = getValues("privilege");
				if (selectedOption) {
					const selected = data.find(
						(x) => x.sequenceNumber === selectedOption.value
					);

					const label = `${selected?.sequenceNumber} - ${
						language !== "ar" ? selected?.name : selected?.nameEnglish
					}`;
					const value = selected?.sequenceNumber;

					setValue("privilege", { label: label, value: value! });
				}
			}
		},
		[getValues, language, setValue]
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
	}, [departmentTypeOptions, getValues, language, setValue]);

	// Workflow Details
	const fetchWorkflow = useMemo(
		() => async (start: number, end: number) => {
			if (end > start) {
				end = 1;
			}

			const range = workflowList.filter((x) => x.id >= end && x.id <= start);

			const options: DropdownOption[] = range.map((x) => {
				const label = `${x.id} - ${
					language !== "ar" ? x.nameArabic : x.nameEnglish
				}`;

				return { label: label, value: x.id };
			});

			if (role !== ROLE.SUPERADMIN) {
				setWorkflowRangeOptions(options);
			}

			// Workflow Start
			const selectedWorkflowStart = options.find((x) => x.value === start);

			if (selectedWorkflowStart) {
				setValue("workflowStart", selectedWorkflowStart!);
			}
			// else {
			// 	const newWorkflow = options.find((x) => x.value === 7);
			// }

			// Workflow End
			const selectedWorkflowEnd = options.find((x) => x.value === end);
			if (selectedWorkflowEnd) {
				setValue("workflowEnd", selectedWorkflowEnd!);
			}
		},
		[language, role, setValue, workflowList]
	);

	useEffect(() => {
		const initialProcess = async () => {
			// Project
			register("project", {
				required: t("error.form.required.project", { framework: "React" }),
			});

			// Privilege
			register("privilege", {
				required: t("error.form.required.privilege", { framework: "React" }),
			});

			// Workflow
			register("workflowStart", {
				required: t("error.form.required.workflowStart", {
					framework: "React",
				}),
			});

			register("workflowEnd", {
				required: t("error.form.required.workflowEnd", {
					framework: "React",
				}),
			});

			// Department
			register("department", {
				required: t("error.form.required.department", { framework: "React" }),
			});

			// Department Structure Type
			register("structureType", {
				required: t("error.form.required.structureType", {
					framework: "React",
				}),
			});

			setValue("structureType", departmentTypeOptions[0]);
			setShowDeleteButton(false);

			if (data) {
				const {
					project,
					privilege,
					workflowStartFrom,
					workflowEndTo,
					department,
					departmentStructureType,
					canGrant,
					canExportExcel,
					canExportPdf,
				} = data;

				// Project
				const selectedProject = projectOptions.find(
					(x) => x.value === project.id
				);

				fetchDepartments(project.id);

				setValue("project", selectedProject!);

				if (role === ROLE.SUPERADMIN) {
					if (selectedProject?.value! === Project.UserManagement) {
						setHideCanGrant(true);
					} else {
						setHideCanGrant(false);
					}
				} else {
					setHideCanGrant(true);
				}

				// const selectedDepartment = departmentsList.find(
				// 	(x) => x.id === department.id
				// )!;

				// setValue("department", {
				// 	label:
				// 		language !== "ar"
				// 			? selectedDepartment?.id + " - " + selectedDepartment?.longFullName
				// 			: selectedDepartment?.id +
				// 			  " - " +
				// 			  selectedDepartment?.longFullNameEnglish,
				// 	value: selectedDepartment?.id!,
				// });
				// console.log(selectedDepartment);

				const selectedDepartment = departmentsOptions.find(
					(x) => x.value === department.id
				)!;

				setValue("department", selectedDepartment!);

				// Privilege

				const selectedPrivilege = privilegeOptions.find(
					(x) => x.value === privilege?.sequenceNumber!
				);
				setValue("privilege", selectedPrivilege!);

				// Workflow
				if (project.hasWorkflow! === false) {
					setDisableWorkflow(true);
				} else {
					if (disableWorkflow === true) {
						setDisableWorkflow(false);
					}
				}

				if (project.hasWorkflow !== false) {
					const { data: up } = await getUserProjectByDepartment(
						project?.id!,
						department?.id!
					);

					if (up) {
						const start = up.workflowStartFrom.id!;
						const end = up.workflowEndTo.id!;

						fetchWorkflow(+start, +end);
					} else {
						const start = data.workflowStartFrom.id!;
						const end = data.workflowEndTo.id!;

						fetchWorkflow(+start, +end);
					}

					// const start = data.workflowStartFrom.id!;
					// const end = data.workflowEndTo.id!;

					// fetchWorkflow(+start, +end);
				}

				const selectedWorkflowStart = workflowList.find(
					(x) => x.id === workflowStartFrom?.id!
				);

				const lblWFS = `${selectedWorkflowStart?.id!} - ${
					language !== "ar"
						? selectedWorkflowStart?.nameArabic
						: selectedWorkflowStart?.nameEnglish!
				}`;

				setValue("workflowStart", {
					label: lblWFS,
					value: selectedWorkflowStart?.id!,
				});

				const selectedWorkflowEnd = workflowRangeOptions.find(
					(x) => x.value === workflowEndTo?.id!
				);
				setValue("workflowEnd", selectedWorkflowEnd!);

				// fetchPrivileges(data!.privilege.sequenceNumber);

				const selectedStructureType = departmentTypeOptions.find(
					(x) => x.value === departmentStructureType.toString()
				);
				setValue("structureType", selectedStructureType!);

				setValue("canGrant", canGrant);
				setValue("canExportExcel", canExportExcel);
				setValue("canExportPdf", canExportPdf);

				setShowDeleteButton(true);
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
		};

		initialProcess();
	}, [
		data,
		setData,
		// departmentTypeOptions,
		// departmentsOptions,
		// setDepartmentsOptions,
		// disableWorkflow,
		// privilegeOptions,
		projectOptions,
		// register,
		// setValue,
		// workflowRangeOptions,
		fetchDepartments,
		language,
	]);

	// comment if not used
	useEffect(() => {
		const fetchData = async () => {
			if (data) {
				const selectedDepartment = departmentsOptions.find(
					(x) => x.value === data.department.id
				)!;

				setValue("department", selectedDepartment!);
				// const start = data.workflowStartFrom.id!;
				// const end = data.workflowEndTo.id!;
				// console.log(data);
				// fetchWorkflow(+start, +end);

				let privId;

				if (!data!.privilege) {
					const {
						insertPrivilege,
						readPrivilege,
						deletePrivilege,
						updatePrivilege,
					} = data!;

					const code = `${+insertPrivilege}${+deletePrivilege}${+updatePrivilege}${+readPrivilege}`;

					const { data: pid } = await getPrivilegeId(code);
					privId = pid;
				} else {
					privId = data!.privilege.sequenceNumber;
				}

				fetchPrivileges(privId!);
			}
		};

		fetchData();
	}, [
		data,
		departmentsOptions,
		fetchPrivileges,
		fetchWorkflow,
		setData,
		setValue,
	]);

	const projectSelectHandler = (option: DropdownOption) => {
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
		} else {
			setHideCanGrant(true);
		}

		setValue("project", option);

		if (option?.value) {
			fetchDepartments(option?.value);
		}
	};

	const departmentSelectHandler = async (option: DropdownOption) => {
		setValue("department", option);

		if (role !== ROLE.SUPERADMIN) {
			const projctId = getValues("project.value");

			const { data: details } = await getUserProjectByDepartment(
				projctId,
				option.value
			);

			if (details) {
				// Privilege
				const selectedPrivilege = privilegeOptions.find(
					(x) => x.value === details.privilege.sequenceNumber
				);
				setValue("privilege", selectedPrivilege!);

				const start = details.workflowStartFrom.id!;
				const end = details.workflowEndTo.id!;

				fetchWorkflow(+start, +end);
				fetchPrivileges(details!.privilege.sequenceNumber);
			}
		}
	};

	const submitHandler = (values: IUserProjectFormInputs) => {
		onActionButtonClick(values);
	};

	const deleteClickHandler = () => {
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = () => {
		setShowModal(false);
		onDelete();
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<div className={styles.assignProject}>
			{title && (
				<ShadowedContainer className={styles.title}>
					<h4>{title}</h4>
				</ShadowedContainer>
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
									/>
								)}
								name="department"
								control={control}
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
					<div className={styles.row}>
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
						<div className={styles.rowItem}>
							<ShadowedContainer className={styles.checkContainer}>
								<Controller
									render={({ field: { onChange, value } }) => (
										<Checkbox
											label={t("export.exportToExcel", {
												framework: "React",
											})}
											checked={value}
											onChange={onChange}
										/>
									)}
									name="canExportExcel"
									control={control}
									// rules={{ required: true }}
								/>
								<Controller
									render={({ field: { onChange, value } }) => (
										<Checkbox
											label={t("export.exportToPdf", {
												framework: "React",
											})}
											checked={value}
											onChange={onChange}
										/>
									)}
									name="canExportPdf"
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
								<span
									className={
										language === "ar"
											? styles.btnContainer
											: styles.btnContainerRTL
									}>
									<Button type="submit">{actionButtonText}</Button>
								</span>
								{showDeleteButton && (
									<span>
										<Button
											type="button"
											isCritical
											onClick={deleteClickHandler}>
											{t("button.delete", { framework: "React" })}
										</Button>
									</span>
								)}
							</ShadowedContainer>
						</div>
					</div>
				</form>
			</ShadowedContainer>

			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</div>
	);
};

export default UserProjectForm;
