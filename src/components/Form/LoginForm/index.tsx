import _ from "lodash/fp";
import { ErrorMessage } from "@hookform/error-message";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, ShadowedContainer, TextBox } from "../..";
import { useStore } from "../../../utils/store";
import { ILoginFormInputs } from "../types";
import styles from "./styles.module.scss";

interface Props {
	onSubmit: (data: ILoginFormInputs) => void;
	serverErrors?: string[];
}

const LoginForm: FC<Props> = ({ onSubmit, serverErrors = [] }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setError,
		setValue,
		control,
	} = useForm<ILoginFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		// Project Name
		register("userName", {
			required: t("error.form.required.userName", { framework: "React" }),
		});

		// Employee Name
		register("password", {
			required: t("error.form.required.password", { framework: "React" }),
		});
	}, [register, t]);

	const submitHandler = (values: ILoginFormInputs) => {
		onSubmit(values);
	};

	return (
		<main className={styles.loginMain}>
			<div className={styles.signinWrapper}>
				<form onSubmit={handleSubmit(submitHandler)}>
					<div className={styles.loginDetail}>
						<div>
							<div>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="text"
											label={t("form.userName", { framework: "React" })}
											value={value}
											onChange={onChange}
										/>
									)}
									name="userName"
									control={control}
									defaultValue={""}
								/>
								{/* <TextBox
                  label="اسم المستخدم"
                  value={userName}
                  onChange={userNameChangeHandler}
                  onKeyDown={keyPressHandler}
                  type="text"
                /> */}
							</div>
							<div>
								<Controller
									render={({ field: { value, onChange } }) => (
										<TextBox
											type="password"
											label={t("form.password", { framework: "React" })}
											value={value}
											onChange={onChange}
											autocomplete="current-password"
										/>
									)}
									name="password"
									control={control}
									defaultValue={""}
								/>

								{/* <TextBox
                  label="كلمة المرور"
                  value={password}
                  onChange={passwordChangeHandler}
                  onKeyDown={keyPressHandler}
                  type="password"
                /> */}
							</div>
						</div>
						<div className={styles.loginBtnBox}>
							<Button type="submit">
								{t("form.signin", { framework: "React" })}
							</Button>
							{/* <LoadingButton
                label="تسجيل الدخول"
                isLoading={isLoading}
                onClick={loginClickHandler}
              /> */}
						</div>
						{Object.keys(errors).length > 0 && (
							<div>
								<ShadowedContainer>
									<ErrorMessage
										errors={errors}
										name="userName"
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
								</ShadowedContainer>
							</div>
						)}
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
						{/* {errorMessage !== "" && (
              <div>
                <MessageBox type="error" message={errorMessage} />
              </div>
            )} */}
					</div>
				</form>
				{/* <!-- login-detail end here--> */}
			</div>
			{/* <!-- signin-wrapper end here--> */}
			<div className={styles.signupWrapper}>
				<div className={styles.signupDetail}>
					<div className={styles.signupDetailText}>
						{t("message.noAccountContact", { framework: "React" })}
					</div>
				</div>
			</div>
		</main>
	);
};

export default LoginForm;
