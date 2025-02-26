import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, FC, useEffect, useState } from "react";
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
import { getFullPath } from "../../../utils";

interface Props {
	data?: APIProjectDetail;
	actionButtonText: string;
	onSubmit: (data: IProjectFormInputs) => void;
	onImageUpload?: (image: File) => void;
}

const ProjectForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
	onImageUpload = () => {},
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IProjectFormInputs>({ criteriaMode: "all" });

	const [projectsOptions, setProjectsOptions] = useState<DropdownOption[]>([]);
	const [projectsGroupOptions, setProjectsGroupOptions] = useState<
		DropdownOption[]
	>([]);
	const [departmentCategoriesOptions, setDepartmentCategoriesOptions] =
		useState<DropdownOption[]>([]);

	const [hideUploadButton, setHideUploadButton] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getParentProjectsList();

			if (data) {
				setProjectsOptions(
					data?.map((d) => {
						return {
							label: language !== "ar" ? d.name : d.nameEnglish,
							value: d.id,
						};
					})
				);

				const selectedOption = getValues("parentProject");

				if (selectedOption) {
					const selected = data.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.name! : selected?.nameEnglish!;

					setValue("parentProject", {
						label: label,
						value: selected?.id,
					});
				}
			}
		};

		fetchData();
	}, [getValues, language, setValue]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getProjectGroups();

			if (data) {
				setProjectsGroupOptions(
					data?.map((d) => {
						return {
							label: language !== "ar" ? d.nameArabic : d.nameEnglish,
							value: d.id,
						};
					})
				);

				const selectedOption = getValues("projectGroup");

				if (selectedOption) {
					const selected = data.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.nameArabic! : selected?.nameEnglish!;

					setValue("projectGroup", {
						label: label,
						value: selected?.id,
					});
				}
			}
		};

		fetchData();
	}, [getValues, language, setValue]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getDepartmentCategories();
			if (data) {
				setDepartmentCategoriesOptions(
					data?.map((d) => {
						return {
							label: language !== "ar" ? d.name : d.nameEnglish,
							value: d.id,
						};
					})
				);

				const selectedOption = getValues("departmentCategory");

				if (selectedOption) {
					const selected = data.find((x) => x.id === selectedOption.value!)!;

					const label =
						language !== "ar" ? selected?.name! : selected?.nameEnglish!;

					setValue("departmentCategory", {
						label: label,
						value: selected?.id,
					});
				}
			}
		};

		fetchData();
	}, [getValues, language, setValue]);

	useEffect(() => {
		// Project Name
		register("name", {
			required: t("error.form.required.nameArabic", { framework: "React" }),
		});

		// Employee Name
		register("nameEnglish", {
			required: t("error.form.required.nameEnglish", { framework: "React" }),
		});

		// Project Group
		register("projectGroup", {
			required: t("error.form.required.projectGroup", { framework: "React" }),
		});

		if (data) {
			const {
				iconName,
				name,
				nameEnglish,
				parent,
				group,
				departmentCategory,
				withAcademy,
				hasWorkflow,
				pathLink,
				isExternalPath,
				isActive,
			} = data;

			setHideUploadButton(false);

			setValue("iconName", iconName);

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

			setValue("withAcademy", withAcademy!);
			setValue("hasWorkflow", hasWorkflow!);
			setValue("pathLink", pathLink! || "");
			setValue("isExternalPath", isExternalPath! || false);
			setValue("displayOnDashboard", isActive || false);
		}
	}, [
		register,
		setValue,
		data,
		projectsGroupOptions,
		projectsOptions,
		departmentCategoriesOptions,
	]);

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("iconName", x);
		}
	};

	const submitHandler = (values: IProjectFormInputs) => {
		onSubmit(values);
	};

	const imageUpdateHandler = () => {
		const image = getValues("thumbnail");
		onImageUpload(image!)!;
	};

	return (
		<ShadowedContainer className={styles.container}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.project}>
					<div className={styles.row}>
						<div
							className={
								language !== "ar"
									? styles.imageContainer
									: styles.imageContainerRTL
							}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<img
										src={value}
										alt=""
										className={styles.image}
									/>
								)}
								name="iconName"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={styles.field}>
							<div className={styles.inputField}>
								<input
									type="file"
									name="thumbnail"
									onChange={imageChangeHandler}
									accept="image/*"
								/>
							</div>
							{hideUploadButton === false && (
								<div>
									<Button
										type="button"
										onClick={imageUpdateHandler}>
										{t("button.update", { framework: "React" })}
									</Button>
								</div>
							)}
						</div>
					</div>
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
							<div>
								<Controller
									render={({ field: { onChange, value } }) => (
										<Checkbox
											label={t("project.withAcademy", { framework: "React" })}
											checked={value}
											onChange={onChange}
										/>
									)}
									name="withAcademy"
									control={control}
									defaultValue={false}
								/>
							</div>
							<div>
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
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("project.urlLink", { framework: "React" })}
										value={value}
										onChange={onChange}
									/>
								)}
								name="pathLink"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div className={clsx(styles.field, styles.check)}>
							<div>
								<Controller
									render={({ field: { onChange, value } }) => (
										<Checkbox
											label={t("project.isExternal", { framework: "React" })}
											checked={value}
											onChange={onChange}
										/>
									)}
									name="isExternalPath"
									control={control}
									defaultValue={false}
								/>
							</div>
						</div>
					</div>
					<ShadowedContainer className={styles.row}>
						<div className={clsx(styles.field, styles.check)}>
							<div>
								<Controller
									render={({ field: { onChange, value } }) => (
										<Checkbox
											label={t("project.displayOnDashboard", {
												framework: "React",
											})}
											checked={value}
											onChange={onChange}
										/>
									)}
									name="displayOnDashboard"
									control={control}
									defaultValue={false}
								/>
							</div>
						</div>
					</ShadowedContainer>
					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
							<ErrorMessage
								errors={errors}
								name="name"
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

							{/* Name English */}
							<ErrorMessage
								errors={errors}
								name="nameEnglish"
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

							{/* Project Group */}
							<ErrorMessage
								errors={errors}
								name="projectGroup"
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
