import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dropdown, ShadowedContainer, TextBox } from "../..";
import Button from "../../Button";
import { DropdownOption } from "../../Dropdown";
import { INewsFormInputs } from "../types";
import { DepartmentCategory } from "../../../data/departmentCategory";
import { Project } from "../../../data/projects";

import { APINewsDetail } from "../../../api/news/types";

import { getMainDepartments } from "../../../api/departments/get/getMainDepartments";
import { getNewsTypes } from "../../../api/news/get/getNewsTypes";

import { getFullPath } from "../../../utils";

import { useStore } from "../../../utils/store";

import styles from "./styles.module.scss";
import ReactPlayer from "react-player";

interface Props {
	data?: APINewsDetail;
	actionButtonText: string;
	onSubmit: (data: INewsFormInputs) => void;
	onImageUpload?: (image: File) => void;
	onVideoUpload?: (video: File) => void;
	serverErrors?: string[];
}

const NewsForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
	onImageUpload = () => {},
	onVideoUpload = () => {},
	serverErrors = [],
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
	} = useForm<INewsFormInputs>({ criteriaMode: "all" });

	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);
	const [newsTypeOptions, setNewsTypeOptions] = useState<DropdownOption[]>([]);

	const [hideUploadButton, setHideUploadButton] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getMainDepartments(
				DepartmentCategory.Main,
				Project.News
			);

			if (data) {
				setDepartmentOptions(
					data?.map((d) => {
						return {
							label: `${d.name}  -  ${d.nameEnglish}`,
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
			const { data } = await getNewsTypes();

			if (data) {
				setNewsTypeOptions(
					data?.map((d) => {
						return {
							label: `${d.name}  -  ${d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		// Department
		register("department", {
			required: t("error.form.required.department", { framework: "React" }),
		});

		// Project Name
		register("title", {
			required: t("error.form.required.title", { framework: "React" }),
		});

		// Employee Name
		register("shortSummary", {
			required: t("error.form.required.shortSummary", { framework: "React" }),
		});

		// Project Group
		register("newsType", {
			required: t("error.form.required.newsType", { framework: "React" }),
		});

		// Project Group
		register("fullNews", {
			required: t("error.form.required.news", { framework: "React" }),
		});

		// Image
		register("imageName", {
			required: t("error.form.required.image", { framework: "React" }),
		});

		// Video
		register("video", {
			validate: {
				fileSize: (file) => {
					if (file) {
						return (
							file.size <= 50 * 1024 * 1024 ||
							t("error.form.validation.fileSize", { framework: "React" })
						);
					}
				},
			},
		});

		if (data) {
			const {
				title,
				shortSummary,
				newsType,
				department,
				fullNews,
				imageName,
				videoName,
			} = data;

			setHideUploadButton(false);

			setValue("title", title);
			setValue("shortSummary", shortSummary);

			const selectedDepartment = departmentOptions.find(
				(x) => x.value === department?.id!
			);

			setValue("department", selectedDepartment!);

			const selectedNewsType = newsTypeOptions.find(
				(x) => x.value === newsType?.id!
			);

			setValue("newsType", selectedNewsType!);
			setValue("fullNews", fullNews);
			setValue("imageName", imageName);
			setValue("videoName", videoName);
		}
	}, [
		data,
		language,
		register,
		newsTypeOptions,
		setValue,
		departmentOptions,
		t,
	]);

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("imageName", x);
		}
	};

	const newsVideoChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("video", file);
			setValue("videoName", x);
		}
	};

	const submitHandler = (values: INewsFormInputs) => {
		onSubmit(values);
	};

	const imageUpdateHandler = () => {
		const image = getValues("thumbnail");
		onImageUpload(image!)!;
	};

	const videoUpdateHandler = () => {
		const video = getValues("video");
		onVideoUpload(video!)!;
	};

	return (
		<form onSubmit={handleSubmit(submitHandler)}>
			<div className={styles.newForm}>
				<div className={styles.row}>
					<ShadowedContainer className={styles.basic}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("news.type", { framework: "React" })}
										options={newsTypeOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="newsType"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<Dropdown
										label={t("department.name", { framework: "React" })}
										options={departmentOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="department"
								control={control}
							/>
						</div>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("news.title", { framework: "React" })}
										value={value}
										onChange={onChange}
									/>
								)}
								name="title"
								control={control}
								defaultValue={""}
							/>
						</div>

						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										type="text"
										label={t("news.shortSummary", { framework: "React" })}
										value={value}
										onChange={onChange}
									/>
								)}
								name="shortSummary"
								control={control}
								defaultValue={""}
							/>
						</div>
						<div>
							<div className={styles.field}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("news.fullNews", { framework: "React" })}
											value={value}
											onChange={onChange}
											multiline={true}
											maxRows={20}
										/>
									)}
									name="fullNews"
									control={control}
									defaultValue={""}
								/>
							</div>
						</div>
						<div className={styles.row}>
							<div className={styles.actions}>
								<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
									<Button type="submit">{actionButtonText}</Button>
								</div>
							</div>
						</div>
					</ShadowedContainer>
					<div>
						<ShadowedContainer
							className={
								language !== "ar"
									? styles.thumbnailContainer
									: styles.thumbnailContainerLTR
							}>
							<h4>{t("image.thumbnail", { framework: "React" })}</h4>
							{/* <ImageUploader/> */}
							<div className={styles.browse}>
								<input
									type="file"
									name="thumbnail"
									onChange={imageChangeHandler}
									accept="image/*"
								/>
							</div>
							<div>
								<Controller
									render={({ field: { value, onChange } }) =>
										value ? (
											<ShadowedContainer>
												<img
													src={value}
													alt=""
													className={styles.image}
												/>
											</ShadowedContainer>
										) : (
											<></>
										)
									}
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
						</ShadowedContainer>
						<ShadowedContainer
							className={
								language !== "ar"
									? styles.thumbnailContainer
									: styles.thumbnailContainerLTR
							}>
							<h4>{t("video.upload", { framework: "React" })}</h4>
							{/* <ImageUploader/> */}
							<div className={styles.browse}>
								<input
									type="file"
									name="video"
									onChange={newsVideoChangeHandler}
									accept="video/mp4"
								/>
							</div>
							<div>
								<Controller
									render={({ field: { value, onChange } }) =>
										value ? (
											<ShadowedContainer>
												<ReactPlayer
													url={value}
													alt=""
													className={styles.image}
													controls={true}
												/>
											</ShadowedContainer>
										) : (
											<></>
										)
									}
									name="videoName"
									control={control}
									defaultValue={""}
								/>
							</div>
							{!hideUploadButton && (
								<div className={styles.uploadSection}>
									<Button
										type="button"
										onClick={videoUpdateHandler}>
										{t("button.update", { framework: "React" })}
									</Button>
								</div>
							)}
						</ShadowedContainer>
					</div>
				</div>

				<div>
					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
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
								name="title"
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

							{/* Short Summary */}
							<ErrorMessage
								errors={errors}
								name="shortSummary"
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

							{/* News Type*/}
							<ErrorMessage
								errors={errors}
								name="newsType"
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
								name="fullNews"
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
				{serverErrors.length > 0 && (
					<ShadowedContainer>
						{serverErrors.map((error, index) => (
							<div
								className="error"
								key={index}>
								{error}
							</div>
						))}
					</ShadowedContainer>
				)}
			</div>
		</form>
	);
};

export default NewsForm;
