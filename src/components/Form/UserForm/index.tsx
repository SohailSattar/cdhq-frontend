import _ from "lodash/fp";
import { FC, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "@hookform/error-message";
import { Button, Dropdown, ShadowedContainer, TextBox } from "../..";
import { getClasses } from "../../../api/classes/get/getClasses";
import { getDepartments } from "../../../api/departments/get/getDepartments";
import { getRanks } from "../../../api/ranks/get/getRanks";
import { useStore } from "../../../utils/store";
import { DropdownOption } from "../../Dropdown";
import { IUserFormInputs } from "../types";

import styles from "./styles.module.scss";
import { APIUserDetail } from "../../../api/users/types";

interface Props {
	isNewUser?: boolean;
	isExistingEmployee?: boolean;
	data?: APIUserDetail;
	hideActionButton?: boolean;
	actionButtonText: string;
	onSubmit: (data: IUserFormInputs) => void;
}

const UserForm: FC<Props> = ({
	isNewUser,
	isExistingEmployee = true,
	data,
	hideActionButton = false,
	actionButtonText,
	onSubmit,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const classRef = useRef<any>(null);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IUserFormInputs>({ criteriaMode: "all" });

	const [classCode, setClassCode] = useState<string>("");

	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);
	const [classOptions, setClassOptions] = useState<DropdownOption[]>([]);
	const [rankOptions, setRankOptions] = useState<DropdownOption[]>([]);

	useEffect(() => {
		// Employee No
		register("employeeNo", {
			required: "Employee No is required.",
			pattern: {
				value: /\d+/,
				message: "Employee No should only be number.",
			},
			// minLength: {
			// 	value: 11,
			// 	message: 'This input must exceed 10 characters',
			// },
		});

		// Employee Name
		register("name", {
			required: "Name is required.",
			pattern: {
				value: /[\u0621-\u064As]+$/,
				message: "Name should only be in arabic alphabets.",
			},
		});

		// Employee Name [English]
		register("nameEnglish", {
			required: "Name [English] is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		// Department
		register("department", {
			required: "Department is required.",
		});

		// Class
		register("userClass", {
			required: "Class is required.",
		});

		// Rank
		register("rank", {
			required: "Rank is required.",
		});

		if (isNewUser) {
			// Password
			register("password", {
				required: "Password is required.",
			});
			register("password2", {
				required: "You have to retype the password",
				validate: (value) =>
					value === getValues("password") || "The passwords do not match",
			});
		}

		if (data) {
			const {
				employeeNo,
				logName,
				name,
				nameEnglish,
				phone,
				email,
				department,
				class: userClass,
				rank,
			} = data;

			setValue("employeeNo", employeeNo);
			setValue("name", name);
			setValue("nameEnglish", nameEnglish);
			setValue("phone", phone || "");
			setValue("email", email || "");

			const selectedDepartment = departmentOptions.find(
				(x) => x.value === department.id
			);
			setValue("department", selectedDepartment!);

			const selectedClass = classOptions.find(
				(x) => x.value === userClass?.id!
			);
			setValue("userClass", selectedClass!);

			const selectedRank = rankOptions.find((x) => x.value === rank?.id!);
			setValue("rank", selectedRank!);

			if (logName !== "") {
				setValue("logName", logName);
			} else {
				const code = selectedClass?.meta!;
				setValue("logName", code + employeeNo);
			}
		}
	}, [
		classOptions,
		isNewUser,
		data,
		departmentOptions,
		rankOptions,
		register,
		getValues,
		setValue,
	]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getDepartments();

			if (data) {
				setDepartmentOptions(
					data.map((x) => ({
						label: language !== "ar" ? x.name : x.nameEnglish,
						value: x.id,
					}))
				);
			}
		};

		fetchData();
	}, [language]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getClasses();

			if (data) {
				setClassOptions(
					data?.map((x) => ({
						label: language !== "ar" ? x.name : x.nameEnglish,
						value: x.id,
						meta: x.logPre,
					}))
				);
			}
		};

		fetchData();
	}, [language]);

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getRanks();

			if (data) {
				setRankOptions(
					data.map((x) => ({
						label: language !== "ar" ? x.name : x.nameEnglish,
						value: x.id,
					}))
				);
			}
		};

		fetchData();
	}, [language]);

	const employeeNumberChangeHandler = (e: any) => {
		const num = e.target.value;

		const logName = getValues("logName");

		if (logName !== "") {
			setValue("logName", classCode + num);
		}

		if (num === "") {
			setClassCode("");
			setValue("logName", "");

			setValue("userClass", { label: "", value: "" });
			classRef!.current!.select!.clearValue();
		}

		setValue("employeeNo", num);
	};

	const classChangeHandler = (option: DropdownOption) => {
		const code = option?.meta!.toString();
		const empNo = getValues("employeeNo");

		setClassCode(code);
		if (option !== null) {
			setValue("logName", code + empNo);
		} else {
			setValue("logName", "");
		}

		setValue("userClass", option);
	};

	return (
		<div className={styles.editUser}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value } }) => (
								<TextBox
									type="text"
									label={t("user.employeeNumber", { framework: "React" })}
									value={value}
									onChange={employeeNumberChangeHandler}
									disabled={isExistingEmployee || !isNewUser}
								/>
							)}
							name="employeeNo"
							control={control}
							defaultValue=""
						/>
					</div>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("user.logName", { framework: "React" })}
									value={value}
									onChange={onChange}
									disabled
								/>
							)}
							name="logName"
							control={control}
							defaultValue=""
						/>
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("user.name", { framework: "React" })}
									value={value}
									onChange={onChange}
									disabled={isExistingEmployee}
								/>
							)}
							name="name"
							control={control}
							defaultValue=""
						/>
					</div>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("user.nameEnglish", { framework: "React" })}
									value={value}
									onChange={onChange}
									disabled={isExistingEmployee}
								/>
							)}
							name="nameEnglish"
							control={control}
							defaultValue=""
						/>
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("user.phone", { framework: "React" })}
									value={value}
									onChange={onChange}
									disabled={isExistingEmployee}
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
									label={t("user.email", { framework: "React" })}
									value={value}
									onChange={onChange}
									disabled={isExistingEmployee}
								/>
							)}
							name="email"
							control={control}
							defaultValue=""
						/>
					</div>
				</div>
				<ShadowedContainer className={styles.section}>
					<div className={styles.dropDownContainer}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<Dropdown
									label={t("department.name", { framework: "React" })}
									options={departmentOptions}
									onSelect={onChange}
									value={value}
									disabled={isExistingEmployee}
								/>
							)}
							name="department"
							control={control}
						/>
					</div>
				</ShadowedContainer>
				<ShadowedContainer className={styles.section}>
					<div className={styles.dropDownContainer}>
						<Controller
							render={({ field: { value } }) => (
								<Dropdown
									label="Class"
									options={classOptions}
									onSelect={classChangeHandler}
									value={value}
									disabled={isExistingEmployee}
									reference={classRef}
								/>
							)}
							name="userClass"
							control={control}
						/>
					</div>
					<div className={styles.dropDownContainer}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<Dropdown
									label={t("rank.name", { framework: "React" })}
									options={rankOptions}
									onSelect={onChange}
									value={value}
									disabled={isExistingEmployee}
								/>
							)}
							name="rank"
							control={control}
						/>
					</div>
				</ShadowedContainer>
				{isNewUser && (
					<ShadowedContainer className={styles.section}>
						<div className={styles.field}>
							<Controller
								render={({ field: { value, onChange } }) => (
									<TextBox
										label={t("form.password", { framework: "React" })}
										value={value}
										onChange={onChange}
										type="password"
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
										label={t("form.retypePassword", { framework: "React" })}
										value={value}
										onChange={onChange}
										type="password"
									/>
								)}
								name="password2"
								control={control}
								defaultValue=""
							/>
						</div>
					</ShadowedContainer>
				)}

				{Object.keys(errors).length > 0 && (
					<ShadowedContainer>
						<ErrorMessage
							errors={errors}
							name="employeeNo"
							render={({ messages }) => {
								return messages
									? _.entries(messages).map(([type, message]) => (
											<p key={type} className="error">
												{message}
											</p>
									  ))
									: null;
							}}
						/>
						<ErrorMessage
							errors={errors}
							name="name"
							render={({ messages }) => {
								return messages
									? _.entries(messages).map(([type, message]) => (
											<p key={type} className="error">
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
											<p key={type} className="error">
												{message}
											</p>
									  ))
									: null;
							}}
						/>
						<ErrorMessage
							errors={errors}
							name="department"
							render={({ messages }) => {
								return messages
									? _.entries(messages).map(([type, message]) => (
											<p key={type} className="error">
												{message}
											</p>
									  ))
									: null;
							}}
						/>

						<ErrorMessage
							errors={errors}
							name="userClass"
							render={({ messages }) => {
								return messages
									? _.entries(messages).map(([type, message]) => (
											<p key={type} className="error">
												{message}
											</p>
									  ))
									: null;
							}}
						/>

						<ErrorMessage
							errors={errors}
							name="rank"
							render={({ messages }) => {
								return messages
									? _.entries(messages).map(([type, message]) => (
											<p key={type} className="error">
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
											<p key={type} className="error">
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
											<p key={type} className="error">
												{message}
											</p>
									  ))
									: null;
							}}
						/>
					</ShadowedContainer>
				)}
				{!hideActionButton && (
					<ShadowedContainer className={styles.buttonSection}>
						<Button
							type="submit"
							className={language !== "ar" ? styles.btn : styles.btnLTR}
						>
							{actionButtonText}
						</Button>
					</ShadowedContainer>
				)}
			</form>
		</div>
	);
};

export default UserForm;
