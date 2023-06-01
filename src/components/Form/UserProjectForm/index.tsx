import { ErrorMessage } from "@hookform/error-message";
import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash/fp";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Dropdown, ShadowedContainer } from "../..";
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

interface Props {
	id?: Id;
	isNormalUser?: boolean;
	title?: string;
	disableProject?: boolean;
	detail?: APIUserProjectDetail;

	actionButtonText: string;
	onActionButtonClick: (data: IUserProjectFormInputs) => void;
}

const UserProjectForm: FC<Props> = ({
	id,
	isNormalUser,
	title,
	disableProject = false,
	detail,
	actionButtonText,
	onActionButtonClick,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const { role } = useStore((state) => state.loggedInUser);

	const [data, setData] = useState<APIUserProjectDetail>();

	useEffect(() => {
		// setData(detail!);
		const fetch = async () => {
			if (id) {
				const { data } = await getUserProject(id!);
				console.log(data);
				setData(data);
			}
		};

		fetch();
	}, [setData]);

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

	// const [showCenterOptions, setShowCenterOptions] = useState<boolean>(false);
	// const [centersOptions, setCentersOptions] = useState<DropdownOption[]>([]);

	const [projectsList, setProjectsList] = useState<APIProjectItem[]>([]);
	const [departmentsList, setDepartmentsList] = useState<APIDepartmentItem[]>(
		[]
	);
	const [priviligesList, setPrivilegesList] = useState<APIPrivilege[]>([]);
	const [workflowList, setWorkflowList] = useState<APIActiveStatus[]>([]);

	const [hideCanGrant, setHideCanGrant] = useState<boolean>(false);

	// useEffect(() => {
	// 	console.log(details);
	// 	if (details!) {
	// 		setData((prevState) => (prevState = details));
	// 	}
	// }, [data, setData]);

	const fetchProjects = useMemo(
		() => async () => {
			const { data: list } = await getProjectsList();

			if (list) {
				setProjectsList(list);
				// setProjectOptions(
				// 	(prevState) =>
				// 		(prevState = list?.map((project: APIProjectItem) => {
				// 			const name =
				// 				language !== "ar" ? project.name : project.nameEnglish;

				// 			return {
				// 				label: `${project.id}`.concat(" - ", name),
				// 				value: project.id,
				// 				meta: {
				// 					hasWorkflow: project.hasWorkflow!,
				// 					departmentSelectionType:
				// 						project.departmentCategory?.code! || "W",
				// 				},
				// 			};
				// 		}))
				// );

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
		[]
	);

	useEffect(() => {
		const fetchData = async () => {
			const { data: list } = await getProjectsList();

			// console.log(list);

			if (list) {
				// setProjectOptions(
				// 	(prevState) =>
				// 		(prevState = list?.map((project: APIProjectItem) => {
				// 			const name =
				// 				language !== "ar" ? project.name : project.nameEnglish;

				// 			return {
				// 				label: `${project.id}`.concat(" - ", name),
				// 				value: project.id,
				// 				meta: {
				// 					hasWorkflow: project.hasWorkflow!,
				// 					departmentSelectionType:
				// 						project.departmentCategory?.code! || "W",
				// 				},
				// 			};
				// 		}))
				// );

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
		};

		fetchData();
	}, [language, setProjectOptions]);

	// Privilege
	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getPrivileges();

			if (data) {
				setPrivilegesList(data);

				setPrivilegeOptions(
					data?.map((privilege: APIPrivilege) => {
						const name = `${privilege.sequenceNumber} - ${
							language != "ar" ? privilege.name : privilege.nameEnglish
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
						language != "ar" ? selected.name : selected.nameEnglish
					}`;

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
				setWorkflowList(data);

				if (role === ROLE.SUPERADMIN)
					setWorkflowRangeOptions(
						data?.map((status: APIActiveStatus) => {
							const name = `${status.id} - ${
								language !== "ar" ? status.nameArabic : status.nameEnglish
							}`;
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

					const label = `${selected.id} - ${
						language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!
					}`;

					setValue("workflowStart", {
						label: label,
						value: selected?.id,
					});
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
				}
			}
		};

		fetchData();
	}, [setWorkflowRangeOptions, language]);

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
									? dept.id + " - " + dept.longFullName
									: dept.id + " - " + dept.longFullNameEnglish,
							value: dept.id,
						};
					})
				);
				const selectedOption = getValues("department");
				if (selectedOption?.value! != "" && selectedOption) {
					console.log(selectedOption);
					const selected = data.find((x) => x.id === selectedOption?.value!)!;
					const label =
						language !== "ar"
							? selected.longFullName
							: selected.longFullNameEnglish;
					const value = selected?.id;

					setValue("department", {
						label: `${value} - ${label}`,
						value: value,
					});

					// // Centers
					// if (showCenterOptions) {
					// 	fetchCenters(selected.id);
					// }
				}
			}
		},
		[setDepartmentsOptions, setDepartmentsList, language]
	);

	// Centers
	// const fetchCenters = useMemo(
	// 	() => async (id: Id) => {
	// 		const { data } = await getCentersByDepartment(id);

	// 		setCentersOptions(
	// 			data!.map((dept: APIDepartmentItem) => {
	// 				const label = `${dept.id} - ${
	// 					language !== "ar" ? dept.longFullName : dept.longFullNameEnglish
	// 				}`;

	// 				return {
	// 					label: label,
	// 					value: dept.id,
	// 				};
	// 			})
	// 		);

	// 		const selectedOption = getValues("center");
	// 		console.log(selectedOption);
	// 		if (selectedOption) {
	// 			const selected = data?.find((x) => x.id === selectedOption?.value);

	// 			console.log(selectedOption);
	// 			if (selected) {
	// 				const label = `${selected?.id} - ${
	// 					language !== "ar" ? selected?.name : selected?.nameEnglish
	// 				}`;

	// 				const value = selected.id;
	// 				setValue("center", {
	// 					label: label,
	// 					value: value,
	// 				});
	// 			}
	// 		}
	// 	},
	// 	[setCentersOptions, language]
	// );

	// Privileges
	const fetchPrivileges = useMemo(
		() => async (id: Id) => {
			const { data } = await getPrivilegesByType(id);

			if (data) {
				setPrivilegeOptions(
					data.map((x) => {
						const label = `${x.sequenceNumber} - ${
							language != "ar" ? x.name : x.nameEnglish
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
						language != "ar" ? selected?.name : selected?.nameEnglish
					}`;
					const value = selected?.sequenceNumber;

					setValue("privilege", { label: label, value: value! });
				}
			}
		},
		[setPrivilegeOptions, language]
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

	// Workflow Details
	const fetchWorkflow = useMemo(
		() => async (start: number, end: number) => {
			const range = workflowList.filter((x) => x.id >= end && x.id <= start);

			const options: DropdownOption[] = range.map((x) => {
				const label = `${x.id} - ${
					language !== "ar" ? x.nameArabic : x.nameEnglish
				}`;

				return { label: label, value: x.id };
			});

			setWorkflowRangeOptions(options);

			// Workflow Start
			const selectedWorkflowStart = options.find((x) => x.value == start);
			setValue("workflowStart", selectedWorkflowStart!);

			// Workflow End
			const selectedWorkflowEnd = options.find((x) => x.value == end);
			setValue("workflowEnd", selectedWorkflowEnd!);
		},
		[setWorkflowRangeOptions, workflowList, language]
	);

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

			fetchDepartments(project.id);

			setValue("project", selectedProject!);
			if (role == ROLE.ADMIN) {
				if (selectedProject?.value! === Project.UserManagement) {
					setHideCanGrant(true);
				} else {
					setHideCanGrant(false);
				}
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
			if (project.hasWorkflow === false) {
				setDisableWorkflow(true);
			} else {
				if (disableWorkflow === true) {
					setDisableWorkflow(false);
				}
			}

			const selectedWorkflowStart = workflowList.find(
				(x) => x.id === workflowStartFrom?.id!
			);

			// const lblWFS = `${selectedWorkflowStart?.id!} - ${
			// 	language != "ar"
			// 		? selectedWorkflowStart?.nameArabic
			// 		: selectedWorkflowStart?.nameEnglish!
			// }`;

			// setValue("workflowStart", {
			// 	label: lblWFS,
			// 	value: selectedWorkflowStart?.id!,
			// });

			// const selectedWorkflowEnd = workflowRangeOptions.find(
			// 	(x) => x.value === workflowEndTo?.id!
			// );
			// setValue("workflowEnd", selectedWorkflowEnd!);

			const start = data.workflowStartFrom.id!;
			const end = data.workflowEndTo.id!;

			// fetchWorkflow(+start, +end);
			// fetchPrivileges(data!.privilege.sequenceNumber);

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
		console.log(data);
		if (data) {
			const selectedDepartment = departmentsOptions.find(
				(x) => x.value === data.department.id
			)!;

			setValue("department", selectedDepartment!);
			const start = data.workflowStartFrom.id!;
			const end = data.workflowEndTo.id!;

			fetchWorkflow(+start, +end);
			fetchPrivileges(data!.privilege.sequenceNumber);
			// setValue("department", { label: "Test", value: "1" });
		}
	}, [data, setData, departmentsOptions]);

	// useEffect(() => {
	// 	const fetch = async () => {
	// 		if (data) {
	// 			const { project, department } = data;
	// 			//

	// 			if (project.departmentCategory.code === DepartmentCategory.Center) {
	// 				setShowCenterOptions(true);
	// 				const centerPrefix = data.department.id.toString().substring(0, 3);

	// 				const mainDepartment = departmentsOptions.find((x) =>
	// 					x.value.toString().startsWith(centerPrefix)
	// 				);

	// 				setValue("department", mainDepartment!);

	// 				//////////////////////////////////////////////////////

	// 				const { data: centersList } = await getCentersByDepartment(
	// 					data.department.id
	// 				);

	// 				// setCentersOptions(
	// 				// 	centersList!.map((dept: APIDepartmentItem) => {
	// 				// 		return {
	// 				// 			label: dept.id
	// 				// 				.toString()
	// 				// 				.concat(
	// 				// 					" - ",
	// 				// 					language !== "ar"
	// 				// 						? dept.longFullName
	// 				// 						: dept.longFullNameEnglish
	// 				// 				),
	// 				// 			value: dept.id,
	// 				// 		};
	// 				// 	})
	// 				// );

	// 				// const currentCenter = centersOptions.find(
	// 				// 	(x) => x.value === data.department.id
	// 				// );

	// 				// setValue("center", currentCenter!);
	// 			} else {
	// 				const selectedDepartment = departmentsOptions.find(
	// 					(x) => x.value === department.id
	// 				);

	// 				setValue("department", selectedDepartment!);
	// 			}
	// 		}
	// 	};

	// 	fetch();
	// }, [data, departmentsOptions, language]);

	// useEffect(() => {
	// 	if (showCenterOptions) {
	// 		// Department Structure Type
	// 		register("center", {
	// 			required: "Center is required.",
	// 		});
	// 	}
	// }, [register, setValue, language, showCenterOptions]);

	// useEffect(() => {
	// 	const fetch = async () => {
	// 		if (data) {
	// 			const { project } = data!;

	// 			// fetchDepartments(project.id);

	// 			if (project.departmentCategory.code === DepartmentCategory.Center) {
	// 				setShowCenterOptions(true);

	// 				const centerPrefix = data.department.id.toString().substring(0, 3);

	// 				const mainDepartment = departmentsOptions.find((x) =>
	// 					x.value.toString().startsWith(centerPrefix)
	// 				);

	// 				setValue("department", mainDepartment!);

	// 				const { data: centersList } = await getCentersByDepartment(
	// 					data.department.id
	// 				);

	// 				setCentersOptions(
	// 					centersList!.map((dept: APIDepartmentItem) => {
	// 						return {
	// 							label: language !== "ar" ? dept.name : dept.nameEnglish,
	// 							value: dept.id,
	// 						};
	// 					})
	// 				);

	// 				const currentCenter = centersOptions.find(
	// 					(x) => x.value === data.department.id
	// 				);

	// 				setValue("center", currentCenter!);
	// 			}
	// 		}
	// 	};

	// 	// fetch();
	// }, [
	// 	data,
	// 	setCentersOptions,
	// 	setDepartmentsOptions,
	// 	// centersOptions,
	// 	// departmentsOptions,
	// ]);

	const projectSelectHandler = (option: DropdownOption) => {
		// setShowCenterOptions(false);
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
			fetchDepartments(option?.value);
		}

		// setCentersOptions([]);

		// if (option?.meta.departmentSelectionType === DepartmentCategory.Center) {
		// 	setShowCenterOptions(true);
		// } else {
		// 	setShowCenterOptions(false);
		// }
	};

	const departmentSelectHandler = async (option: DropdownOption) => {
		// setCentersOptions([]);
		// setValue("center", { label: "", value: "", meta: null });
		setValue("department", option);

		// if (role !== ROLE.SUPERADMIN) {
		// if (!showCenterOptions) {
		//Fetch Details
		const projctId = getValues("project.value");

		const { data: details } = await getUserProjectByDepartment(
			projctId,
			option.value
		);

		if (details) {
			// Privilege
			const selectedPrivilege = privilegeOptions.find(
				(x) => x.value == details.privilege.sequenceNumber
			);
			setValue("privilege", selectedPrivilege!);

			const start = details.workflowStartFrom.id!;
			const end = details.workflowEndTo.id!;

			fetchWorkflow(+start, +end);
			fetchPrivileges(details!.privilege.sequenceNumber);
		}
		// }
		// }

		// if (showCenterOptions) {
		// 	fetchCenters(option.value);
		// }
	};

	// const centerSelectHandler = async (option: DropdownOption) => {
	// 	setValue("center", option!);
	// 	//Fetch Details
	// 	const projctId = getValues("project.value");

	// 	// if (role === ROLE.ADMIN) {
	// 	if (option) {
	// 		const { data: details } = await getUserProjectByDepartment(
	// 			projctId,
	// 			option?.value
	// 		);

	// 		if (details) {
	// 			// Privilege
	// 			const selectedPrivilege = privilegeOptions.find(
	// 				(x) => x.value == details.privilege.sequenceNumber
	// 			);
	// 			setValue("privilege", selectedPrivilege!);

	// 			// Workflow Start
	// 			const selectedWorkflowStart = workflowRangeOptions.find(
	// 				(x) => x.value == details.workflowStartFrom.id
	// 			);
	// 			setValue("workflowStart", selectedWorkflowStart!);

	// 			// Workflow End
	// 			const selectedWorkflowEnd = workflowRangeOptions.find(
	// 				(x) => x.value == details.workflowEndTo.id
	// 			);
	// 			setValue("workflowEnd", selectedWorkflowEnd!);

	// 			const start = details?.workflowStartFrom.id!;
	// 			const end = details?.workflowEndTo.id!;

	// 			fetchWorkflow(+start, +end);
	// 			fetchPrivileges(details!.privilege.sequenceNumber);
	// 		}
	// 	}
	// 	// }
	// };

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
						{/* {showCenterOptions && (
							<div className={styles.rowItem}>
								<Controller
									render={({ field: { value } }) => (
										<Dropdown
											label={t("department.center", { framework: "React" })}
											options={centersOptions}
											onSelect={centerSelectHandler}
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
						)} */}
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
