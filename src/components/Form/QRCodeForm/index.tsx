import _ from "lodash/fp";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { IQRCodeFormInputs } from "../types";
import { Button, Dropdown, ShadowedContainer, TextBox } from "../..";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { Controller, useForm } from "react-hook-form";
import { APIQRCodeDetail } from "../../../api/qr-codes/types";
import { getFullPath } from "../../../utils";
import { ErrorMessage } from "@hookform/error-message";

interface Props {
	data?: APIQRCodeDetail;
	actionButtonText: string;
	onSubmit: (data: IQRCodeFormInputs) => void;
	onImageUpload?: (image: File) => void;
	onIconUpload?: (icon: File) => void;
	serverErrors?: string[];
}

const QRCodeForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
	onImageUpload = () => {},
	onIconUpload = () => {},
	serverErrors = [],
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [hideUploadButton, setHideUploadButton] = useState<boolean>(true);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IQRCodeFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		// Link type Name
		register("name", {
			required: t("error.form.required.nameArabic", { framework: "React" }),
		});

		// Link type Name [English]
		register("nameEnglish", {
			required: t("error.form.required.nameEnglish", { framework: "React" }),
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		// Image
		register("imageName", {
			required: t("error.form.required.image", { framework: "React" }),
		});

		if (data) {
			setHideUploadButton(false);
			const { name, nameEnglish, imageName, iconName } = data;

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);
			setValue("imageName", imageName);
			setValue("iconName", iconName!);
		}
	}, [data, register, setValue, t]);

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("image", file);
			setValue("imageName", x);
		}
	};

	const iconChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("icon", file);
			setValue("iconName", x);
		}
	};

	const imageUpdateHandler = () => {
		const image = getValues("image");
		onImageUpload(image!)!;
	};

	const iconUpdateHandler = () => {
		const video = getValues("icon");
		onIconUpload(video!)!;
	};

	const submitHandler = (values: IQRCodeFormInputs) => {
		onSubmit(values);
	};

	return (
		<form onSubmit={handleSubmit(submitHandler)}>
			<div className={styles.qrCodeForm}>
				<div className={styles.row}>
					<div className={styles.basic}>
						<ShadowedContainer>
							<div className={styles.field}>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("global.name", { framework: "React" })}
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
											label={t("global.nameEnglish", { framework: "React" })}
											value={value}
											onChange={onChange}
										/>
									)}
									name="nameEnglish"
									control={control}
									defaultValue={""}
								/>
							</div>

							<div className={styles.row}>
								<div className={styles.actions}>
									<div
										className={language !== "ar" ? styles.btn : styles.btnLTR}>
										<Button type="submit">{actionButtonText}</Button>
									</div>
								</div>
							</div>
						</ShadowedContainer>
					</div>
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
											<ShadowedContainer className={styles.imageContainer}>
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
							<h4>{t("qrCode.icon", { framework: "React" })}</h4>
							{/* <ImageUploader/> */}
							<div className={styles.browse}>
								<input
									type="file"
									name="icon"
									onChange={iconChangeHandler}
									accept="image/*"
								/>
							</div>
							<div>
								<Controller
									render={({ field: { value, onChange } }) =>
										value ? (
											<ShadowedContainer className={styles.imageContainer}>
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
									name="iconName"
									control={control}
									defaultValue={""}
								/>
							</div>
							{!hideUploadButton && (
								<div className={styles.uploadSection}>
									<Button
										type="button"
										onClick={iconUpdateHandler}>
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

export default QRCodeForm;

// ;
