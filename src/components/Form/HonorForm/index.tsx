import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	Dropdown,
	PhotoThumbnailImage,
	SearchBox,
	ShadowedContainer,
	TextBox,
} from "../..";
import { getEmployeesByKeyword } from "../../../api/employees/get/getEmployeesByKeyword";
import { APIHonor } from "../../../api/honors/types";
import { getFullPath } from "../../../utils";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";
import { IHonorFormInputs } from "../types";

import styles from "./styles.module.scss";
import { Project } from "../../../data/projects";

interface Props {
	data?: APIHonor;
	actionButtonText: string;
	onSubmit: (data: IHonorFormInputs) => void;
	onImageUpload?: (image: File) => void;
}

const HonorForm: FC<Props> = ({
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
	} = useForm<IHonorFormInputs>({ criteriaMode: "all" });

	const [hideSearchBox, setHideSearchBox] = useState<boolean>(false);

	const [employeesOptions, setEmployeesOptions] = useState<DropdownOption[]>(
		[]
	);

	const [selectedEmployeesOption, setSelctedEmployeesOption] =
		useState<DropdownOption>();

	const [hideUploadButton, setHideUploadButton] = useState<boolean>(true);

	const honorTypeOptions: DropdownOption[] = useMemo(() => {
		return [
			{
				label: t("honor.type.talented", {
					framework: "React",
				}),
				value: 1,
				meta: "موهوب",
			},
			{
				label: t("honor.type.empOfMonth", {
					framework: "React",
				}),
				value: 2,
				meta: "متميز",
			},
		];
	}, [t]);

	useEffect(() => {
		// Project Name
		register("honorType", {
			required: t("error.form.required.honorType", { framework: "React" }),
		});

		// // Project Name
		// register("name", {
		// 	required: t("error.form.required.nameEnglish", { framework: "React" }),
		// });

		// // Project Name
		// register("rank", {
		// 	required: t("error.form.required.rank", { framework: "React" }),
		// });

		// // Department
		// register("department", {
		// 	required: t("error.form.required.department", { framework: "React" }),
		// });

		// Project Name
		register("imageName", {
			required: t("error.form.required.image", { framework: "React" }),
		});

		if (data) {
			const { name, rank, department, imageName, type } = data;

			setHideUploadButton(false);

			var selectedType = honorTypeOptions.find((x) => x.meta === type);

			setValue("honorType", selectedType!);

			setValue("name", name);
			setValue("rank", rank);
			setValue("department", department);
			setValue("imageName", imageName);
			setHideSearchBox(true);
		}
	}, [data, honorTypeOptions, language, register, setValue, t]);

	const employeeNumberSearchHandler = async (value: string) => {
		const { data } = await getEmployeesByKeyword(value, Project.Honors);

		if (data) {
			setEmployeesOptions(
				data?.map((d) => {
					return {
						label: `${d.employeeNo}  -  ${d.nameEnglish}`,
						value: d.id,
						meta: {
							id: d.id,
							name: d.nameEnglish,
							rank: d.rank?.name,
							dept: d.department?.longFullName,
						},
					};
				})
			);

			if (data.length > 0) {
				const { employeeNo, nameEnglish, id, rank, department } = data[0];

				setSelctedEmployeesOption({
					label: `${employeeNo}  -  ${nameEnglish}`,
					value: data[0].id,
					meta: {
						id: id,
						name: nameEnglish,
						rank: rank?.name,
						dept: department?.longFullName,
					},
				});

				setValue("employeeId", id);
				setValue("name", nameEnglish);
				setValue("rank", rank?.name!);
				setValue("department", department?.longFullName!);
			}
		}
	};

	const employeeSelectHandler = (option: DropdownOption) => {
		if (option) {
			const { id, name, rank, dept } = option.meta;

			setSelctedEmployeesOption(option);

			setValue("employeeId", id);
			setValue("name", name);
			setValue("rank", rank);
			setValue("department", dept);
		}
	};

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("imageName", x);
		}
	};

	const imageUpdateHandler = () => {
		const image = getValues("thumbnail");
		onImageUpload(image!)!;
	};

	const submitHandler = (values: IHonorFormInputs) => {
		onSubmit(values);
	};

	return (
		<div className={styles.honorForm}>
			{!hideSearchBox && (
				<div className={styles.row}>
					<div className={styles.basic}>
						<div>
							<SearchBox onClick={employeeNumberSearchHandler} />
						</div>
					</div>
				</div>
			)}
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.row}>
					<ShadowedContainer className={styles.basic}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("honor.type.name", { framework: "React" })}
										options={honorTypeOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="honorType"
								control={control}
							/>
						</div>
						{!hideSearchBox && (
							<div>
								<Dropdown
									options={employeesOptions}
									onSelect={employeeSelectHandler}
									value={selectedEmployeesOption}
								/>
							</div>
						)}
						<div>
							<Controller
								render={({ field: { value } }) => (
									<TextBox
										type="text"
										label={t("user.name", { framework: "React" })}
										value={value}
										disabled
									/>
								)}
								name="name"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div>
							<Controller
								render={({ field: { value } }) => (
									<TextBox
										type="text"
										label={t("rank.name", { framework: "React" })}
										value={value}
										disabled
									/>
								)}
								name="rank"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div>
							<Controller
								render={({ field: { value } }) => (
									<TextBox
										type="text"
										label={t("department.name", { framework: "React" })}
										value={value}
										disabled
									/>
								)}
								name="department"
								control={control}
								defaultValue={""}
							/>
						</div>
					</ShadowedContainer>
					<div
						className={
							language !== "ar"
								? styles.thumbnailContainer
								: styles.thumbnailContainerLTR
						}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<ShadowedContainer className={styles.thumbnail}>
									{value && (
										<img
											src={value}
											alt="thumbnail"
											className={styles.image}
										/>
									)}
									{/* <div className={styles.actionContainer}>
										<FontAwesomeIcon icon={faXmark} />
									</div> */}
									<input
										type="file"
										name="thumbnail"
										onChange={imageChangeHandler}
										accept="image/*"
									/>
									{!hideUploadButton && (
										<div className={styles.uploadSection}>
											<Button
												type="button"
												onClick={imageUpdateHandler}>
												{t("button.update", { framework: "React" })}
											</Button>
										</div>
									)}
								</ShadowedContainer>
							)}
							name="imageName"
							control={control}
							defaultValue={""}
						/>
					</div>
					{/* <ShadowedContainer
						className={
							language !== "ar"
								? styles.thumbnailContainer
								: styles.thumbnailContainerLTR
						}>
						<div className={styles.browse}>
							<input
								type="file"
								name="thumbnail"
								onChange={imageChangeHandler}
								accept="image/*"
							/>
						</div>
						<div className={styles.imageContainer}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<ShadowedContainer className={styles.thumbnail}>
										<PhotoThumbnailImage src={value} />
										<div className={styles.actionContainer}>
											<FontAwesomeIcon icon={faXmark} />
										</div>
									</ShadowedContainer>
								)}
								name="imageName"
								control={control}
								defaultValue={""}
							/>
						</div>
						{!hideUploadButton && (
							<div className={styles.uploadSection}>
								<Button
									type="button"
									onClick={imageUpdateHandler}>
									{t("button.update", { framework: "React" })}
								</Button>
							</div>
						)}
					</ShadowedContainer> */}
				</div>
				<div>
					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
							{/* Detail */}
							<ErrorMessage
								errors={errors}
								name="honorType"
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

							{/* Detail */}
							<ErrorMessage
								errors={errors}
								name="imageName"
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
				</div>
				<div className={styles.buttonSection}>
					<Button type="submit">{actionButtonText}</Button>
				</div>
			</form>
			<div></div>
		</div>
	);
};

export default HonorForm;
