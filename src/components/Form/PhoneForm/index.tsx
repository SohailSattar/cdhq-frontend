import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, ShadowedContainer, TextBox } from "../..";
import { APIPhoneDirectory } from "../../../api/phoneDirectory/types";
import { IPhoneFormInputs } from "../types";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import clsx from "clsx";

interface Props {
	data?: APIPhoneDirectory;
	actionButtonText: string;
	onSubmit: (inputs: IPhoneFormInputs) => void;
}

const PhoneForm: FC<Props> = ({ data, actionButtonText, onSubmit }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const { handleSubmit, setValue, control } = useForm<IPhoneFormInputs>({
		criteriaMode: "all",
	});

	useEffect(() => {
		if (data) {
			const { id, phone, phone2, phoneOffice } = data;
			setValue("id", id);
			setValue("phone", phone);
			setValue("phone2", phone2);
			setValue("phoneOffice", phoneOffice);
		}
	}, [data, setValue]);

	const submitHandler = (values: IPhoneFormInputs) => {
		onSubmit(values);
	};

	return (
		<div className={styles.phoneForm}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<ShadowedContainer
					className={clsx(styles.section, styles.headingContainer)}>
					<div className={styles.heading}>
						<div>
							<span className={styles.title}>
								{t("user.employeeNumber", { framework: "React" })}
							</span>{" "}
							: {data?.employeeNo}{" "}
						</div>
						<div>
							<span className={styles.title}>
								{t("rank.name", { framework: "React" })}
							</span>{" "}
							: {language !== "ar" ? data?.rank?.name : data?.rank?.nameEnglish}
						</div>{" "}
						<div>
							<span className={styles.title}>
								{t("user.name", { framework: "React" })}
							</span>{" "}
							: {language !== "ar" ? data?.name : data?.nameEnglish}
						</div>
					</div>
				</ShadowedContainer>{" "}
				<ShadowedContainer
					className={clsx(styles.section, styles.headingContainer)}>
					<div className={styles.heading}>
						{language !== "ar"
							? data?.department?.fullName
							: data?.department?.fullNameEnglish}
					</div>
				</ShadowedContainer>
				<ShadowedContainer className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("user.phone", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="phone"
							control={control}
							defaultValue=""
						/>
					</div>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("user.phone", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="phone2"
							control={control}
							defaultValue=""
						/>
					</div>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("user.phoneOffice", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="phoneOffice"
							control={control}
							defaultValue=""
						/>
					</div>
				</ShadowedContainer>
				<div className={styles.section}>
					<Button type="submit">{actionButtonText}</Button>
				</div>
			</form>
		</div>
	);
};

export default PhoneForm;
