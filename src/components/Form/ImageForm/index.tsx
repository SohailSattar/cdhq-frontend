import _ from "lodash/fp";

import { useTranslation } from "react-i18next";
import ShadowedContainer from "../../ShadowedContainer";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import { IImageFormInputs } from "..";
import { Controller, useForm } from "react-hook-form";
import { APIImage } from "../../../api/images/types";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Button, Dropdown, TextBox } from "../..";
import { getFullPath } from "../../../utils";
import { DropdownOption } from "../../Dropdown";
import { getImageTypes } from "../../../api/imageType/get/getImageTypes";
import { ErrorMessage } from "@hookform/error-message";
import ReactPlayer from "react-player";

interface Props {
	data?: APIImage;
	actionButtonText: string;
	onSubmit: (data: IImageFormInputs) => void;
	onImageUpload?: (image: File) => void;
	onVideoUpload?: (video: File) => void;
	serverErrors?: string[];
}

const ImageForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
	onImageUpload = () => {},
	onVideoUpload = () => {},
	serverErrors = [],
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [imageTypeOptions, setImageTypeOptions] = useState<DropdownOption[]>(
		[]
	);

	const [hideRatingField, setHideRatingField] = useState<boolean>(true);

	const [hideImageUploadButton, setHideImageUploadButton] =
		useState<boolean>(true);
	const [hideVideoUploadButton, setHideVideoUploadButton] =
		useState<boolean>(true);

	const [isVideo, setIsVideo] = useState<boolean>(false);

	const {
		register,
		unregister,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IImageFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		// Name Arabic
		register("name", {
			required: t("error.form.required.nameArabic", { framework: "React" }),
		});

		// Name English
		register("nameEnglish", {
			required: t("error.form.required.nameEnglish", { framework: "React" }),
		});

		// Image Type
		register("imageType", {
			required: t("error.form.required.imageType", { framework: "React" }),
		});

		// Thumbnail
		// register("thumbnail", {
		// 	required: t("error.form.required.image", { framework: "React" }),
		// });

		// Thumbnail
		register("imageName", {
			required: t("error.form.required.image", { framework: "React" }),
		});

		if (data) {
			const { name, nameEnglish, imageName, videoName, imageType, stars } =
				data;

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);
			setValue("imageName", imageName);
			setValue("videoName", videoName);

			const type = imageTypeOptions.find((x) => x.value === imageType?.id!);

			setValue("imageType", type!);

			if (imageType!.id === 2) {
				setHideRatingField(false);
				setValue("stars", stars?.toString());
			} else if (imageType!.id === 4) {
				setIsVideo(true);
			}
		}
	}, [data, imageTypeOptions, register, setValue, t]);

	const fetchImageTypes = useCallback(async () => {
		const { data } = await getImageTypes();

		if (data) {
			setImageTypeOptions(
				data?.map((d) => {
					return {
						label: `${language !== "ar" ? d.name : d.nameEnglish}`,
						value: d.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchImageTypes();
	}, [fetchImageTypes]);

	const imageTypeSelectHandler = (option: DropdownOption) => {
		if (option) {
			if (option.value === 2) {
				setHideRatingField(false);
			} else {
				setHideRatingField(true);
			}

			if (option.value === 4) {
				setIsVideo(true);
				// Set validation rule for videoFile when imageType is 4
				// register("video", {
				// 	required: t("error.form.required.video", { framework: "React" }),
				// 	validate: (value) => {
				// 		if (value) {
				// 			// Check if the file size is less than 50 MB
				// 			return (
				// 				value.size <= 50 * 1024 * 1024 || t("error.form.videoSize")
				// 			);
				// 		}
				// 		return true; // If no file is selected, consider it valid
				// 	},
				// });
				register("videoFile", {
					required: t("error.form.required.video", { framework: "React" }),
					validate: (value) => {
						if (value) {
							// Check if the file size is less than 50 MB
							return (
								value.size <= 50 * 1024 * 1024 ||
								t("error.form.validation.fileSize")
							);
						}
						return true; // If no file is selected, consider it valid
					},
				});
			} else {
				setIsVideo(false);

				// Unset validation rule for videoFile when imageType is not 4
				unregister("videoFile");
			}

			setValue("imageType", option);
		}
		setValue("imageType", option);
	};

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("imageName", x);

			if (data) {
				setHideImageUploadButton(false);
			}
		}
	};

	const imageUpdateHandler = () => {
		const image = getValues("thumbnail");
		onImageUpload(image!)!;
	};

	const videoChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("videoFile", file);
			setValue("videoName", x);

			if (data) {
				setHideVideoUploadButton(false);
			}
		}
	};
	const videoUpdateHandler = () => {
		const video = getValues("videoFile");
		onVideoUpload(video!)!;
	};

	const submitHandler = (values: IImageFormInputs) => {
		onSubmit(values);
	};

	return (
		<div className={styles.imageForm}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.row}>
					<div className={styles.formContainer}>
						<ShadowedContainer>
							<div>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("image.name", { framework: "React" })}
											value={value}
											onChange={onChange}
										/>
									)}
									name="name"
									control={control}
									defaultValue={""}
								/>
							</div>
							<div>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("image.nameEnglish", { framework: "React" })}
											value={value}
											onChange={onChange}
										/>
									)}
									name="nameEnglish"
									control={control}
									defaultValue={""}
								/>
							</div>
							<div>
								<Controller
									render={({ field: { value, onChange } }) => (
										<Dropdown
											label={t("image.type", { framework: "React" })}
											options={imageTypeOptions}
											onSelect={imageTypeSelectHandler}
											value={value}
										/>
									)}
									name="imageType"
									control={control}
									// defaultValue={}
								/>
							</div>
							{!hideRatingField && (
								<div>
									<Controller
										render={({ field: { value, onChange } }) => (
											<TextBox
												type="number"
												label={t("image.ratings", { framework: "React" })}
												value={value!}
												onChange={onChange}
											/>
										)}
										name="stars"
										control={control}
										defaultValue={""}
									/>
								</div>
							)}
							<div className={styles.buttonSection}>
								<Button type="submit">{actionButtonText}</Button>
							</div>
						</ShadowedContainer>
					</div>
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
									{!hideImageUploadButton && (
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

						{isVideo && (
							<Controller
								render={({ field: { value, onChange } }) => (
									<ShadowedContainer className={styles.thumbnail}>
										{value && (
											<ReactPlayer
												url={value}
												alt=""
												className={styles.image}
												controls={true}
											/>
										)}
										{/* <div className={styles.actionContainer}>
										<FontAwesomeIcon icon={faXmark} />
									</div> */}
										<input
											type="file"
											name="videoFile"
											onChange={videoChangeHandler}
											accept="video/mp4"
										/>
										{!hideVideoUploadButton && (
											<div className={styles.uploadSection}>
												<Button
													type="button"
													onClick={videoUpdateHandler}>
													{t("button.update", { framework: "React" })}
												</Button>
											</div>
										)}
									</ShadowedContainer>
								)}
								name="videoName"
								control={control}
								defaultValue={""}
							/>
						)}
					</div>
				</div>
				<div>
					{Object.keys(errors).length > 0 && (
						<ShadowedContainer>
							{/* Name*/}
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

							{/* Image type */}
							<ErrorMessage
								errors={errors}
								name="imageType"
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

							{/* Image  */}
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

							{/* Image  */}
							<ErrorMessage
								errors={errors}
								name="videoFile"
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
							{/* Image  */}
							{/* <ErrorMessage
								errors={errors}
								name="videoFile"
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
							/> */}
						</ShadowedContainer>
					)}{" "}
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
		</div>
	);
};

export default ImageForm;
