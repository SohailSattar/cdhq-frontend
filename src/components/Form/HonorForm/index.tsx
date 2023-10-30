import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import {
	ChangeEvent,
	FC,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
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

	const [keyword, setKeyword] = useState<string>();

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
		if (language !== "ar") {
			// setValue("honorType", )
			console.log(getValues("honorType"));
		} else {
		}
		console.log(getValues("honorType"), honorTypeOptions);

		const hType = getValues("honorType");

		if (hType) {
			const selectedType = honorTypeOptions.find(
				(x) => x.value === hType.value
			);
			setValue("honorType", selectedType!);
		}

		// console.log
	}, [getValues, honorTypeOptions, language, setValue]);

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
			const {
				name,
				nameEnglish,
				rank,
				rankEnglish,
				work,
				workEnglish,
				imageName,
				type,
			} = data;

			setHideUploadButton(false);

			var selectedType = honorTypeOptions.find((x) => x.meta === type);

			setValue("honorType", selectedType!);

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);
			setValue("rank", rank);
			setValue("rankEnglish", rankEnglish);
			setValue("department", work);
			setValue("departmentEnglish", workEnglish);
			setValue("imageName", imageName);
			setHideSearchBox(true);
		}
	}, [data, honorTypeOptions, language, register, setValue, t]);

	const fetchEmployees = useCallback(
		async (value: string) => {
			const { data } = await getEmployeesByKeyword(value, Project.Honors);

			if (data) {
				setEmployeesOptions(
					data?.map((d) => {
						return {
							label: `${d.employeeNo}  -  ${
								language !== "ar" ? d.name : d.nameEnglish
							}`,
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
					const { employeeNo, name, nameEnglish, id, rank, department } =
						data[0];

					setSelctedEmployeesOption({
						label: `${employeeNo}  -  ${
							language !== "ar" ? name : nameEnglish
						}`,
						value: data[0].id,
						meta: {
							id: id,
							name: nameEnglish,
							rank: rank?.name,
							rankEnglish: rank?.nameEnglish,
							dept: department?.name,
							deptEnglish: department?.nameEnglish,
						},
					});

					setValue("employeeId", id);
					setValue("name", name);
					setValue("nameEnglish", nameEnglish);
					setValue("rank", rank?.name!);
					setValue("rankEnglish", rank?.nameEnglish!);
					setValue("department", department?.longFullName!);
					setValue("departmentEnglish", department?.longFullNameEnglish!);
				}
			}
		},
		[language, setValue]
	);

	useEffect(() => {
		fetchEmployees(keyword!);
	}, [fetchEmployees, keyword]);

	const employeeNumberSearchHandler = (value: string) => {
		setKeyword(value);
	};

	const employeeSelectHandler = (option: DropdownOption) => {
		if (option) {
			const { id, name, nameEnglish, rank, rankEnglish, dept, deptEnglish } =
				option.meta;

			setSelctedEmployeesOption(option);

			setValue("employeeId", id);
			setValue("name", name);
			setValue("nameEnglish", nameEnglish);
			setValue("rank", rank);
			setValue("rankEnglish", rankEnglish);
			setValue("department", dept);
			setValue("departmentEnglish", deptEnglish);
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
						</div>{" "}
						<div>
							<Controller
								render={({ field: { value } }) => (
									<TextBox
										type="text"
										label={t("user.nameEnglish", { framework: "React" })}
										value={value}
										disabled
									/>
								)}
								name="nameEnglish"
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
										label={t("rank.name", { framework: "React" })}
										value={value}
										disabled
									/>
								)}
								name="rankEnglish"
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
								name="departmentEnglish"
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
