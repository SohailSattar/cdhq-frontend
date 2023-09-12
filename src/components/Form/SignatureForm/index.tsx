import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, IEmployeeSignatureFormInputs, ShadowedContainer } from "../..";
import { APIEmployeeSignature } from "../../../api/employees/types";

import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getFullPath } from "../../../utils";
import { useStore } from "../../../utils/store";

import styles from "./styles.module.scss";

interface Props {
	data?: APIEmployeeSignature;
	onSubmit: (data: IEmployeeSignatureFormInputs) => void;
}

const SignatureForm: FC<Props> = ({ data, onSubmit }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IEmployeeSignatureFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		register("thumbnail", {
			required: "Thumbnail is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		if (data) {
			const { imageName } = data;

			setValue("imageName", imageName!);
		}
	}, [data, register, setValue]);

	const imageChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];
			const x = getFullPath(file);
			setValue("thumbnail", file);
			setValue("imageName", x);

			setShowUpdateButton(true);
		}
	};

	return (
		<ShadowedContainer className={styles.signForm}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.section}>
					<div
						className={
							language !== "ar"
								? styles.thumbnailContainer
								: styles.thumbnailContainerLTR
						}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<ShadowedContainer>
									<img
										src={value}
										alt=""
										className={styles.image}
									/>
								</ShadowedContainer>
							)}
							name="imageName"
							control={control}
							defaultValue={""}
						/>
					</div>
					<div className={styles.browse}>
						<input
							type="file"
							name="thumbnail"
							onChange={imageChangeHandler}
							accept="image/png"
						/>
					</div>
				</div>
				{showUpdateButton && (
					<div className={styles.buttonSection}>
						<Button
							type="submit"
							className={language !== "ar" ? styles.btn : styles.btnLTR}>
							{t("button.update", { framework: "React" })}
						</Button>
					</div>
				)}
			</form>
		</ShadowedContainer>
	);
};

export default SignatureForm;
