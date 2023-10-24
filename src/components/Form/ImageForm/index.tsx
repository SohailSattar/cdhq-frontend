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

interface Props {
	data?: APIImage;
	actionButtonText: string;
	onSubmit: (data: IImageFormInputs) => void;
	onImageUpload?: (image: File) => void;
}

const ImageForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
	onImageUpload = () => {},
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [imageTypeOptions, setImageTypeOptions] = useState<DropdownOption[]>(
		[]
	);

	const [hideRatingField, setHideRatingField] = useState<boolean>(true);

	const [hideUploadButton, setHideUploadButton] = useState<boolean>(true);

	const {
		register,
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
			const { name, nameEnglish, imageName, imageType, stars } = data;

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);
			setValue("imageName", imageName);

			const type = imageTypeOptions.find((x) => x.value === imageType?.id!);

			setValue("imageType", type!);

			if (imageType!.id === 2) {
				setHideRatingField(false);
				setValue("stars", stars?.toString());
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

			setValue("imageType", option);
		}
	};

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("imageName", x);

			if (data) {
				setHideUploadButton(false);
			}
		}
	};

	const imageUpdateHandler = () => {
		const image = getValues("thumbnail");
		onImageUpload(image!)!;
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
							</ShadowedContainer>
						)}
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
				</div>
			</form>
		</div>
	);
};

export default ImageForm;
