import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, ShadowedContainer, TextBox } from "../..";
import { IPasswordFormInputs } from "../types";
import styles from "./styles.module.scss";

interface Props {
	onSubmit: (data: IPasswordFormInputs) => void;
}

const PasswordForm: FC<Props> = ({ onSubmit }) => {
	const [t] = useTranslation("common");

	const {
		register,
		formState: { errors },
		handleSubmit,
		getValues,
		control,
	} = useForm<IPasswordFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		register("password", {
			required: "Password is required.",
			minLength: {
				value: 12,
				message: "Password should be 12 characters long",
			},
		});
		register("password2", {
			required: t("error.form.required.nameArabic", { framework: "React" }),
			validate: (value) =>
				value === getValues("password") || "The passwords do not match",
		});
	}, [register, getValues, t]);

	return (
		<div className={styles.passwordForm}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="password"
								label={t("form.password", { framework: "React" })}
								value={value}
								onChange={onChange}
							/>
						)}
						name="password"
						control={control}
						defaultValue=""
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="password"
								label={t("form.retypePassword", { framework: "React" })}
								value={value}
								onChange={onChange}
							/>
						)}
						name="password2"
						control={control}
						defaultValue=""
					/>
				</div>
				<div className={styles.field}>
					<Button type="submit">
						{t("button.update", { framework: "React" })}
					</Button>
				</div>
				{Object.keys(errors).length > 0 && (
					<ShadowedContainer>
						<ErrorMessage
							errors={errors}
							name="password"
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
							name="password2"
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
			</form>
		</div>
	);
};

export default PasswordForm;
