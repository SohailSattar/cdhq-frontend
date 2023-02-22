import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Dropdown, ShadowedContainer, TextBox } from "../..";
import { getProjectGroups } from "../../../api/projectGroup/get/getProjectGroups";
import { getParentProjectsList } from "../../../api/projects/get/getParentProjectsList";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";
import { IProjectFormInputs } from "../types";

import styles from "./styles.module.scss";
import { APIProjectDetail } from "../../../api/projects/types";
import { getDepartmentCategories } from "../../../api/departmentCategories/get/getDepartmentCategories";
import clsx from "clsx";

interface Props {
	data?: APIProjectDetail;
	onSubmit: (data: IProjectFormInputs) => void;
	actionButtonText: string;
}

const ProjectForm: FC<Props> = ({ data, onSubmit, actionButtonText }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setError,
		setValue,
		control,
	} = useForm<IProjectFormInputs>({ criteriaMode: "all" });

	const [projectsOptions, setProjectsOptions] = useState<DropdownOption[]>([]);
	const [projectsGroupOptions, setProjectsGroupOptions] = useState<
		DropdownOption[]
	>([]);
	const [departmentCategoriesOptions, setDepartmentCategoriesOptions] =
		useState<DropdownOption[]>([]);

	// useEffect(() => {

	// 	setProject(data!);
	// }, [data, setValue]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getParentProjectsList();

			if (data) {
				setProjectsOptions(
					data?.map((d) => {
						return { label: `${d.name}  -  ${d.nameEnglish}`, value: d.id };
					})
				);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getProjectGroups();

			if (data) {
				setProjectsGroupOptions(
					data?.map((d) => {
						return {
							label: `${d.nameArabic}  -  ${d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getDepartmentCategories();

			if (data) {
				setDepartmentCategoriesOptions(
					data?.map((d) => {
						return {
							label: d.nameEnglish,
							value: d.id,
						};
					})
				);
			}
		};

		fetchData();
	}, []);

	const clear = () => {
		reset(
			{ name: "", nameEnglish: "", projectGroup: { label: "", value: "" } },
			{ keepIsValid: false, keepErrors: true }
		);
	};

	useEffect(() => {
		// Project Name
		register("name", {
			required: "Name is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in arabic alphabets.',
			// },
		});

		// Employee Name
		register("nameEnglish", {
			required: "Name [English] is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		// Project Group
		register("projectGroup", {
			required: "Project group is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		if (data) {
			const {
				name,
				nameEnglish,
				parent,
				group,
				departmentCategory,
				hasWorkflow,
			} = data;
			setValue("name", name);
			setValue("nameEnglish", nameEnglish);

			const selectedProject = projectsOptions.find(
				(x) => x.value === parent.id
			);
			setValue("parentProject", selectedProject!);

			const selectedProjectGroup = projectsGroupOptions.find(
				(x) => x.value === group.id
			);
			setValue("projectGroup", selectedProjectGroup!);

			const selectedDepartmentCategory = departmentCategoriesOptions.find(
				(x) => x.value === departmentCategory?.id!
			);
			setValue("departmentCategory", selectedDepartmentCategory!);

			setValue("hasWorkflow", hasWorkflow!);
		}
	}, [data, projectsGroupOptions, projectsOptions, register, setValue]);

	const submitHandler = (values: IProjectFormInputs) => {
		onSubmit(values);
	};

	return (
		<ShadowedContainer className={styles.container}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.project}>
					<div className={styles.row}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("project.nameArabic", { framework: "React" })}
										value={value}
										onChange={onChange}
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
										label={t("project.nameEnglish", { framework: "React" })}
										value={value}
										onChange={onChange}
									/>
								)}
								name="nameEnglish"
								control={control}
								defaultValue={""}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("project.parentProject", { framework: "React" })}
										options={projectsOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="parentProject"
								control={control}
								defaultValue={{ label: "", value: "" }}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("project.group", { framework: "React" })}
										options={projectsGroupOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="projectGroup"
								control={control}
								defaultValue={{ label: "", value: "" }}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("project.deptCat", { framework: "React" })}
										options={departmentCategoriesOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="departmentCategory"
								control={control}
								defaultValue={{ label: "", value: "" }}
							/>
						</div>
						<div className={clsx(styles.field, styles.check)}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Checkbox
										label={t("project.hasWorkflow", { framework: "React" })}
										checked={value}
										onChange={onChange}
									/>
								)}
								name="hasWorkflow"
								control={control}
								defaultValue={false}
							/>
						</div>
					</div>

					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
							<ErrorMessage
								errors={errors}
								name="name"
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

							{/* Name English */}
							<ErrorMessage
								errors={errors}
								name="nameEnglish"
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

							{/* Project Group */}
							<ErrorMessage
								errors={errors}
								name="projectGroup"
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
						<div className={styles.actions}>
							<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
								<Button type="submit">{actionButtonText}</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</ShadowedContainer>
	);
};

export default ProjectForm;
