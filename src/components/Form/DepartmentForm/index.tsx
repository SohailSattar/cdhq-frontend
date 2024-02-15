import _ from "lodash/fp";
import { Controller, useForm } from "react-hook-form";
import {
	Button,
	Dropdown,
	IDepartmentFormInputs,
	ShadowedContainer,
	TextBox,
} from "../..";

import {
	APIDepartmentDetail,
	APIDepartmentItem,
} from "../../../api/departments/types";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { getDepartmentLevels } from "../../../api/departmentLevel/get/getDepartmentLevels";
import { DropdownOption } from "../../Dropdown";

import styles from "./styles.module.scss";
import { ErrorMessage } from "@hookform/error-message";
import clsx from "clsx";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";
import { getEmirates } from "../../../api/emirates/get/getEmirates";
import { getCdBuildings } from "../../../api/civilDefenseBuildings/get/getCdBuildings";
import { getDepartmentStatuses } from "../../../api/departmentStatuses/get/getDepartmentStatuses";
import { getDepartmentGroups } from "../../../api/departmentGroups/get/getDepartmentGroups";
import { getDepartmentOperators } from "../../../api/departmentOperators/get/getDepartmentOperators";
interface Props {
	data?: APIDepartmentDetail;
	actionButtonText: string;
	onSubmit: (data: IDepartmentFormInputs) => void;
}

const DepartmentForm: FC<Props> = ({ data, actionButtonText, onSubmit }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [levelOptions, setLevelOptions] = useState<DropdownOption[]>([]);
	const [emirateOptions, setEmirateOptions] = useState<DropdownOption[]>([]);
	const [departments, setDepartments] = useState<DropdownOption[]>([]);
	const [statusOptions, setStatusOptions] = useState<DropdownOption[]>([]);
	const [operatorOptions, setOperatorOptions] = useState<DropdownOption[]>([]);
	const [groupOptions, setGroupOptions] = useState<DropdownOption[]>([]);
	const [cdBuildingOptions, setCdBuildingOptions] = useState<DropdownOption[]>(
		[]
	);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IDepartmentFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		// Department Name
		register("name", {
			required: t("error.form.required.nameArabic", { framework: "React" }),
		});

		// Name English
		register("nameEnglish", {
			required: t("error.form.required.nameEnglish", { framework: "React" }),
		});

		// Level
		register("level", {
			required: t("error.form.required.level", { framework: "React" }),
		});

		// Emirate
		register("emirate", {
			required: t("error.form.required.emirate", { framework: "React" }),
		});

		// Parent
		register("parent", {
			required: t("error.form.required.parentDepartment", {
				framework: "React",
			}),
		});

		// Status
		register("status", {
			required: t("error.form.required.status", { framework: "React" }),
		});

		// Oprator
		register("operator", {
			required: t("error.form.required.operator", { framework: "React" }),
		});

		if (data) {
			const {
				name,
				nameEnglish,
				level,
				region,
				parent,
				status,
				operator,
				group,
				cdBuilding,
			} = data;

			console.log(data);

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);

			// Level
			const selectedLevel = levelOptions.find((x) => x.value === level?.id!);
			setValue("level", selectedLevel!);

			// Emirate
			const selectedEmirate = emirateOptions.find(
				(x) => x.value === region?.id!
			);

			console.log(region);

			setValue("emirate", selectedEmirate!);

			// Parent
			const selectedParent = departments.find((x) => x.value === parent?.id!);
			setValue("parent", selectedParent!);

			// Status
			const selectedStatus = statusOptions.find((x) => x.value === status?.id!);
			setValue("status", selectedStatus!);

			// Operator
			const selectedOperator = operatorOptions.find(
				(x) => x.value === operator?.id!
			);
			setValue("operator", selectedOperator!);

			// Group
			const selectedGroup = groupOptions.find((x) => x.value === group?.id!);
			setValue("group", selectedGroup!);

			// Civil Defense Building
			const selectedCdBuilding = cdBuildingOptions.find(
				(x) => x.value === cdBuilding?.id!
			);
			setValue("cdBuilding", selectedCdBuilding!);
		}
	}, [
		cdBuildingOptions,
		data,
		departments,
		emirateOptions,
		groupOptions,
		levelOptions,
		operatorOptions,
		register,
		setValue,
		statusOptions,
		t,
	]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getCategorizedDepartments();

			if (data) {
				setDepartments(
					data.map((x) => ({
						label: `${x.id} - ${
							language !== "ar" ? x.fullName : x.fullNameEnglish
						}`,
						value: x.id,
					}))
				);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentLevels();

			if (data) {
				setLevelOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getEmirates();

			if (data) {
				setEmirateOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentStatuses();

			if (data) {
				setStatusOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentOperators();

			if (data) {
				setOperatorOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentGroups();

			if (data) {
				setGroupOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getCdBuildings();

			if (data) {
				setCdBuildingOptions(
					data.map((x) => ({
						label: `${language !== "ar" ? x.name : x.nameEnglish}`,
						value: x.id,
					}))
				);
				// setLevels(data);
			}
		};

		fetch();
	}, [language]);

	const submitHandler = (values: IDepartmentFormInputs) => {
		onSubmit(values);
	};

	return (
		<ShadowedContainer className={styles.container}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.department}>
					<div className={styles.row}>
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
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("department.level", { framework: "React" })}
										options={levelOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="level"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("emirate.name", { framework: "React" })}
										options={emirateOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="emirate"
								control={control}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("department.parent", { framework: "React" })}
										options={departments}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="parent"
								control={control}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("department.status", { framework: "React" })}
										options={statusOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="status"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("department.operator", { framework: "React" })}
										options={operatorOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="operator"
								control={control}
							/>
						</div>
					</div>
					<div className={styles.row}>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("department.group", { framework: "React" })}
										options={groupOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="group"
								control={control}
							/>
						</div>
						<div className={styles.ddlField}>
							<Controller
								render={({ field: { onChange, value } }) => (
									<Dropdown
										label={t("cd.building", { framework: "React" })}
										options={cdBuildingOptions}
										onSelect={onChange}
										value={value}
									/>
								)}
								name="cdBuilding"
								control={control}
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

							{/* Level */}
							<ErrorMessage
								errors={errors}
								name="level"
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

							{/* Emirate */}
							<ErrorMessage
								errors={errors}
								name="emirate"
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

							{/* Parent */}
							<ErrorMessage
								errors={errors}
								name="parent"
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

							{/* Status */}
							<ErrorMessage
								errors={errors}
								name="status"
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

							{/* Operator */}
							<ErrorMessage
								errors={errors}
								name="operator"
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

					<div className={styles.row}>
						<div className={styles.actions}>
							<div className={language !== "ar" ? styles.btn : styles.btnLTR}>
								<Button type="submit">{actionButtonText}</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</ShadowedContainer>
		// <ShadowedContainer className={styles.deptForm}>
		// 	<form onSubmit={handleSubmit(submitHandler)}>
		// 		<div className={styles.row}>
		// 			<ShadowedContainer className={styles.basic}>
		// 				<div className={styles.section}>
		// 					<div className={styles.field}>
		// 						<Controller
		// 							render={({ field: { value } }) => (
		// 								<TextBox
		// 									type="text"
		// 									label={t("global.name", { framework: "React" })}
		// 									value={value}
		// 								/>
		// 							)}
		// 							name="name"
		// 							control={control}
		// 							defaultValue={""}
		// 						/>
		// 					</div>
		// 					<div className={styles.field}>
		// 						<Controller
		// 							render={({ field: { value } }) => (
		// 								<TextBox
		// 									type="text"
		// 									label={t("global.nameEnglish", {
		// 										framework: "React",
		// 									})}
		// 									value={value}
		// 								/>
		// 							)}
		// 							name="nameEnglish"
		// 							control={control}
		// 							defaultValue={""}
		// 						/>
		// 						{/* <TextBox
		// 							label={t("global.name", { framework: "React" })}
		// 							value={name}
		// 							type="text"
		// 							onChange={nameChangeHandler}
		// 						/> */}
		// 					</div>
		// 					{/* <div className={styles.field}>
		// 						<TextBox
		// 							label={t("global.nameEnglish", { framework: "React" })}
		// 							value={nameEnglish}
		// 							type="text"
		// 							onChange={nameEnglishChangeHandler}
		// 						/>
		// 					</div> */}
		// 				</div>
		// 				<div className={styles.section}>
		// 					<div className={styles.field}>
		// 						<Controller
		// 							render={({ field: { onChange, value } }) => (
		// 								<Dropdown
		// 									label={t("honor.type.name", { framework: "React" })}
		// 									options={levelOptions}
		// 									onSelect={onChange}
		// 									value={value}
		// 								/>
		// 							)}
		// 							name="level"
		// 							control={control}
		// 						/>
		// 						{/* <Dropdown
		// 							label="Level"
		// 							options={levelOptions}
		// 							value={selectedLevelOption}
		// 							onSelect={levelOptionChangeHandler}
		// 						/> */}
		// 					</div>
		// 					{/* <div className={styles.field}>
		// 						<TextBox
		// 							label={t("department.fullName", { framework: "React" })}
		// 							value={fullName}
		// 							type="text"
		// 							// onChange={() => {}}
		// 							disabled
		// 						/>
		// 					</div>
		// 					<div className={styles.field}>
		// 						<TextBox
		// 							label={t("department.fullNameEnglish", {
		// 								framework: "React",
		// 							})}
		// 							value={fullNameEnglish}
		// 							type="text"
		// 							// onChange={() => {}}
		// 							disabled
		// 						/>
		// 					</div> */}
		// 				</div>
		// 				<div className={styles.section}>
		// 					{/* <div className={styles.field}>
		// 						<Dropdown
		// 							label={t("emirate.name", { framework: "React" })}
		// 							options={emirates}
		// 							value={selectedEmirate}
		// 							onSelect={emirateSelectHandler}
		// 						/>
		// 					</div>
		// 					<div className={styles.field}>
		// 						<Dropdown
		// 							label={t("department.parent", { framework: "React" })}
		// 							options={departments}
		// 							value={selectedParentDepartment}
		// 							onSelect={parentDepartmentSelectHandler}
		// 						/>
		// 					</div> */}
		// 				</div>
		// 			</ShadowedContainer>
		// 			<ShadowedContainer className={styles.section}>
		// 				<div className={styles.buttonSection}>
		// 					<div className={styles.btn}>
		// 						{/* <Button onClick={onActionClick}>{actionButtonText}</Button> */}
		// 					</div>
		// 				</div>
		// 			</ShadowedContainer>
		// 		</div>
		// 	</form>
		// </ShadowedContainer>
	);
};

export default DepartmentForm;
