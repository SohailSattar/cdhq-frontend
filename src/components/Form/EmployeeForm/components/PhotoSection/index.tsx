import { useTranslation } from "react-i18next";
import {
	Button,
	IEmployeePhotoFormInputs,
	ShadowedContainer,
} from "../../../..";
import { useStore } from "../../../../../utils/store";

import styles from "../../styles.module.scss";
import { Controller, useFormContext } from "react-hook-form";
import { ChangeEvent, FC, useState } from "react";
import { getFullPath } from "../../../../../utils";

interface Props {
	canUpdate: boolean;
	mode: "INSERT" | "UPDATE";
	onImageUpload?: (image: File) => void;
}

const PhotoSection: FC<Props> = ({
	canUpdate,
	mode,
	onImageUpload = () => {},
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const [hideUploadButton, setHideUploadButton] = useState<boolean>(true);

	const {
		control,
		formState: { errors },
		setValue,
		getValues,
	} = useFormContext<IEmployeePhotoFormInputs>();

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			if (mode === "UPDATE") {
				setHideUploadButton(false);
			}
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("photo", x);
		}
	};

	const imageUpdateHandler = () => {
		const image = getValues("thumbnail");
		setHideUploadButton(true);
		onImageUpload(image!)!;
	};

	return (
		<ShadowedContainer
			className={
				language !== "ar"
					? styles.thumbnailContainer
					: styles.thumbnailContainerLTR
			}>
			<h4>{t("employee.photo", { framework: "React" })}</h4>
			{/* <ImageUploader/> */}
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
					name="photo"
					control={control}
					defaultValue={""}
				/>
			</div>
			{canUpdate && (
				<div className={styles.browse}>
					<input
						type="file"
						name="thumbnail"
						onChange={imageChangeHandler}
						accept="image/*"
					/>
				</div>
			)}
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
	);
};

export default PhotoSection;
