import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
	Button,
	Dropdown,
	PhotoThumbnailImage,
	SearchBox,
	ShadowedContainer,
	TextBox,
} from "../..";
import { getExistingEmployees } from "../../../api/employees/get/getExistingEmployeesList";
import { APIHonorDetail } from "../../../api/honors/types";
import { getFullPath } from "../../../utils";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";
import { IHonorFormInputs } from "../types";

import styles from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
	data?: APIHonorDetail;
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

	useEffect(() => {
		// Department
		register("department", {
			required: "Department is required.",
		});

		// Project Name
		register("name", {
			required: "Name is required.",
		});
		console.log(data);

		if (data) {
			const { name, rank, department, imageName } = data;

			setHideUploadButton(true);

			setValue("name", name);
			setValue("rank", rank);
			setValue("department", department);
			setValue("imageName", imageName);
			setHideSearchBox(true);
		}
	}, [data, language, register, setValue]);

	const employeeNumberSearchHandler = async (value: string) => {
		const { data } = await getExistingEmployees(value);
		console.log(data);

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
		console.log(option);
		const { id, name, rank, dept } = option.meta;

		setValue("employeeId", id);
		setValue("name", name);
		setValue("rank", rank);
		setValue("department", dept);
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
		// onImageUpload(image!)!;
	};

	console.log(getValues("thumbnail"));

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
					<div className={styles.basic}>
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
					</div>
					<div
						className={
							language !== "ar"
								? styles.thumbnailContainer
								: styles.thumbnailContainerLTR
						}
					>
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
								<Button type="button" onClick={imageUpdateHandler}>
									{t("button.update", { framework: "React" })}
								</Button>
							</div>
						)}
					</div>
				</div>
				<div>
					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
							{/* Employee*/}
							<ErrorMessage
								errors={errors}
								name="newsType"
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

							{/* Detail */}
							<ErrorMessage
								errors={errors}
								name="fullNews"
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
