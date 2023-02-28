import {
	Dispatch,
	FC,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { getActiveStatusWithoutInactive } from "../../../api/activeStatus/get/getActiveStatusWithoutInactive";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";
import {
	APICategorizedDepartment,
	APIDepartmentItem,
} from "../../../api/departments/types";
import _ from "lodash/fp";
import { getPrivileges } from "../../../api/privileges/get/getPrivileges";
import { APIPrivilege } from "../../../api/privileges/type";
import { getProjectsList } from "../../../api/projects/get/getProjectsList";
import { APIProjectItem } from "../../../api/projects/types";
import {
	Button,
	Checkbox,
	Dropdown,
	RadioButton,
	ShadowedContainer,
} from "../..";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";
import { Id } from "../../../utils";
import { getUsersListByDepartment } from "../../../api/departments/get/getUsersListByDepartment";
import { getDepartments } from "../../../api/departments/get/getDepartments";
import { getProjectInfoStatus } from "../../../api/projects/get/getProjectInfoStatus";

import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import { IProjectUserFormInputs } from "../types";
import { ErrorMessage } from "@hookform/error-message";
import { APIUserProjectDetail } from "../../../api/userProjects/types";
import { getMainDepartments } from "../../../api/departments/get/getMainDepartments";

interface Props {
	mode: "ADD" | "EDIT";
	id: string;
	isNormalUser?: boolean;
	heading?: string;
	data?: APIUserProjectDetail;
	actionButtonText: string;
	onActionButtonClick: (data: IProjectUserFormInputs) => void;
}

const ProjectUserForm: FC<Props> = ({
	mode,
	id,
	isNormalUser = true,
	heading,
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
		setValue,
		control,
	} = useForm<IProjectUserFormInputs>({ criteriaMode: "all" });

	const empDeptRef = useRef<any>(null);
	const userRef = useRef<any>(null);

	const [empDepartmentsOptions, setEmpDepartmentsOptions] = useState<
		DropdownOption[]
	>([]);

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
	const [usersOptions, setUsersOptions] = useState<DropdownOption[]>([]);

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
		() => async (code?: string) => {
			console.log(code);
			const { data } = await getMainDepartments(code);

			if (data) {
				setDepartmentsOptions(
					data.map((dept: APIDepartmentItem) => {
						return {
							label: language !== "ar" ? dept.name : dept.nameEnglish,
							value: dept.id,
						};
					})
				);
			}
		},
		[setDepartmentsOptions, language]
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
		[setDepartmentsOptions, language]
	);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const { data } = await getCategorizedDepartments();

	// 		if (data) {
	// 			const options: DropdownOption[] = data.map(
	// 				(dept: APICategorizedDepartment) => {
	// 					return { label: dept.longFullName, value: dept.id };
	// 				}
	// 			);

	// 			setDepartmentsOptions(options);

	// 			setEmpDepartmentsOptions(options);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getProjectInfoStatus(id);

			if (data) {
				if (data.hasWorkflow === false) {
					setDisableWorkflow(true);
					setValue(
						"workflowStart",
						workflowRangeOptions.find((x) => x.value === 7)!
					);

					setValue(
						"workflowEnd",
						workflowRangeOptions.find((x) => x.value === 1)!
					);
				} else {
					setDisableWorkflow(false);
				}

				if (data?.departmentCategory! !== null) {
					if (data?.departmentCategory?.code! !== "C") {
						fetchMainDepartments(data?.departmentCategory?.code!);
					} else {
						fetchCategorizedDepartments();
					}
				} else {
					fetchCategorizedDepartments();
				}
			}
		};

		fetchData();
	}, [id, setValue, workflowRangeOptions]);

	const departmentTypeOptions = useMemo(() => {
		return [
			{ value: "9", label: t("project.withChild", { framework: "React" }) },
			{ value: "1", label: t("project.withoutChild", { framework: "React" }) },
		];
	}, [t]);

	useEffect(() => {
		// User
		register("user", {
			required: "User is required.",
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
				user,
				project,
				privilege,
				workflowStartFrom,
				workflowEndTo,
				department,
				departmentStructureType,
				canGrant,
			} = data;

			// Project
			const userName = language !== "ar" ? user.name : user.nameEnglish;
			setValue("user", { label: userName, value: user.id });

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

			// Department
			const selectedDepartment = departmentsOptions.find(
				(x) => x.value === department.id
			);
			setValue("department", selectedDepartment!);

			const selectedStructureType = departmentTypeOptions.find(
				(x) => x.value === departmentStructureType.toString()
			);
			setValue("structureType", selectedStructureType!);

			setValue("canGrant", canGrant);
		}
	}, [
		data,
		departmentTypeOptions,
		departmentsOptions,
		disableWorkflow,
		language,
		privilegeOptions,
		register,
		setValue,
		usersOptions,
		workflowRangeOptions,
	]);

	const empDepartmentSelectHandler = async (option: DropdownOption) => {
		userRef!.current!.select!.clearValue();
		setUsersOptions([]);
		const deptId = option?.value!.toString();

		if (deptId) {
			const { data } = await getUsersListByDepartment(deptId);

			if (data) {
				setUsersOptions(
					data?.map((dept) => {
						return { label: dept.name, value: dept.id };
					})
				);
			}
		} else {
		}
	};

	const submitHandler = (values: IProjectUserFormInputs) => {
		onActionButtonClick(values);
	};

	return (
		<div className={styles.assignProject}>
			<>
				<div>
					<h4>{heading}</h4>
				</div>
				<ShadowedContainer>
					<form onSubmit={handleSubmit(submitHandler)}>
						<div className={styles.row}>
							{mode === "ADD" && (
								<div className={styles.rowItem}>
									<Dropdown
										label={t("user.department", { framework: "React" })}
										options={empDepartmentsOptions}
										onSelect={empDepartmentSelectHandler}
										reference={empDeptRef}
									/>
								</div>
							)}
							<div className={styles.rowItem}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<Dropdown
											label={t("user.name", { framework: "React" })}
											options={usersOptions}
											value={value}
											onSelect={onChange}
											disabled={mode === "EDIT"}
											reference={userRef}
										/>
									)}
									name="user"
									control={control}
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
											value={value}
											onSelect={onChange}
										/>
									)}
									name="department"
									control={control}
								/>
							</div>
							<div className={styles.rowItem}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<Dropdown
											label={t("privilege.name", { framework: "React" })}
											options={privilegeOptions}
											value={value}
											onSelect={onChange}
										/>
									)}
									name="privilege"
									control={control}
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
											label={t("userProject.workflowEnd", {
												framework: "React",
											})}
											options={workflowRangeOptions}
											onSelect={onChange}
											value={value}
											disabled={disableWorkflow}
										/>
									)}
									name="workflowEnd"
									control={control}
								/>
							</div>
						</div>
						{/* <div className={styles.row}>
							<div className={styles.rowItem}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<Dropdown
											label={t("department.name", { framework: "React" })}
											options={departmentsOptions}
											onSelect={onChange}
											value={value}
										/>
									)}
									name="department"
									control={control}
									// rules={{ required: true }}
								/>
							</div>
						</div> */}
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
											defaultValue={false}
										/>
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
			</>
		</div>
	);
};

export default ProjectUserForm;
