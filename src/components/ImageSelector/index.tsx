import {
	ChangeEvent,
	ChangeEventHandler,
	FC,
	MouseEventHandler,
	useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, PhotoThumbnailImage, ShadowedContainer } from "..";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { getFullPath } from "../../utils";

export interface Props {
	imageSrc: string;
	onImageChange: ChangeEventHandler<HTMLInputElement>;
	onImageUpdate?: MouseEventHandler<HTMLButtonElement>;
	hideUploadButton?: boolean;
}

const ImageSelector: FC<Props> = ({
	imageSrc,

	onImageChange,
	onImageUpdate,
	hideUploadButton,
}) => {
	const [t] = useTranslation("common");
	const language = "ar";

	const [imgsrc, setImgsrc] = useState(imageSrc);

	const imageChangehandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			// setValue("thumbnail", file);
			// setValue("imageName", x);
			setImgsrc(x);
		}
	};

	const imageRemoveClickHandler = () => {
		setImgsrc("");
	};

	return (
		<div
			className={
				language !== "ar" ? styles.imageSelector : styles.imageSelectorLTR
			}>
			<div className={styles.browse}>
				<input
					type="file"
					name="thumbnail"
					onChange={imageChangehandler}
					accept="image/*"
				/>
			</div>
			<div className={styles.imageContainer}>
				<ShadowedContainer className={styles.thumbnail}>
					<PhotoThumbnailImage src={imgsrc} />
					<div className={styles.actionContainer}>{/* <Button */}</div>
				</ShadowedContainer>
			</div>
			{!hideUploadButton && (
				<div className={styles.uploadSection}>
					<Button
						type="button"
						onClick={onImageUpdate}>
						{t("button.update", { framework: "React" })}
					</Button>
				</div>
			)}
		</div>
	);
};

export default ImageSelector;
