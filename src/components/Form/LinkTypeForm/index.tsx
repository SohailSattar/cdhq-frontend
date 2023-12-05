import _ from "lodash/fp";
import { Controller, useForm } from "react-hook-form";
import { ILinkTypeFormInputs } from "..";
import ShadowedContainer from "../../ShadowedContainer";

import styles from "./styles.module.scss";
import { APILinkTypeDetail } from "../../../api/linkTypes/types";
import { FC, useEffect } from "react";
import { Button, Checkbox, TextBox } from "../..";
import { ErrorMessage } from "@hookform/error-message";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";

interface Props {
	data?: APILinkTypeDetail;
	actionButtonText: string;
	onSubmit: (data: ILinkTypeFormInputs) => void;
}

const LinkTypeForm: FC<Props> = ({ data, actionButtonText, onSubmit }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		control,
	} = useForm<ILinkTypeFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		// Link type Name
		register("name", {
			required: "Name is required.",
		});

		// Link type Name [English]
		register("nameEnglish", {
			required: "Name [English] is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		if (data) {
			const { name, nameEnglish, isFile } = data;

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);
			setValue("isFile", isFile);
		}
	}, [data, register, setValue]);

	const submitHandler = (values: ILinkTypeFormInputs) => {
		onSubmit(values);
	};

	return (
		<ShadowedContainer className={styles.linkTypeForm}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("menu.name", { framework: "React" })}
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
									label={t("menu.nameEnglish", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="nameEnglish"
							control={control}
							defaultValue={""}
						/>
					</div>
				</div>

				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { onChange, value } }) => (
								<Checkbox
									label={t("menu.isVisible", { framework: "React" })}
									checked={value}
									onChange={onChange}
								/>
							)}
							name="isFile"
							control={control}
							defaultValue={false}
						/>
					</div>
				</div>

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
					</ShadowedContainer>
				)}
				<div className={styles.buttonSection}>
					<Button
						type="submit"
						className={language !== "ar" ? styles.btn : styles.btnLTR}>
						{actionButtonText}
					</Button>
				</div>
			</form>
		</ShadowedContainer>
	);
};

export default LinkTypeForm;
