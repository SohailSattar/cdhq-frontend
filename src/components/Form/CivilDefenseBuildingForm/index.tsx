import _ from "lodash/fp";
import { useTranslation } from "react-i18next";
import {
	Button,
	Dropdown,
	ICivilDefenseBuildingFormInputs,
	ShadowedContainer,
	TextBox,
} from "../..";

import styles from "./styles.module.scss";
import { useStore } from "../../../utils/store";
import { Controller, useForm } from "react-hook-form";
import { APICivilDefenseBuildingDetail } from "../../../api/civilDefenseBuildings/types";
import { FC, useCallback, useEffect, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { DropdownOption } from "../../Dropdown";
import { getCdBuildingsOwners } from "../../../api/civilDefenseBuildingsOwners/get/getCdBuildingsOwners";
import { getDepartments } from "../../../api/departments/get/getDepartments";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";

interface Props {
	data?: APICivilDefenseBuildingDetail;
	actionButtonText: string;
	onSubmit: (data: ICivilDefenseBuildingFormInputs) => void;
}

const CivilDefenseBuildingForm: FC<Props> = ({
	data,
	actionButtonText,
	onSubmit,
}) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		control,
	} = useForm<ICivilDefenseBuildingFormInputs>({ criteriaMode: "all" });

	const [ownerOptions, setOwnerOptions] = useState<DropdownOption[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>(
		[]
	);

	const fetchOwners = useCallback(async () => {
		const { data } = await getCdBuildingsOwners();

		if (data) {
			setOwnerOptions(
				data?.map((d) => {
					return {
						label: `${language !== "ar" ? d.name : d.nameEnglish}`,
						value: d.id,
					};
				})
			);
		}
	}, [language]);

	const fetchDpartments = useCallback(async () => {
		const { data } = await getCategorizedDepartments();

		if (data) {
			setDepartmentOptions(
				data?.map((d) => {
					return {
						label: `${d.id} - ${
							language !== "ar" ? d.fullName : d.fullNameEnglish
						}`,
						value: d.id,
					};
				})
			);
		}
	}, [language]);

	useEffect(() => {
		fetchOwners();
	}, [fetchOwners]);

	useEffect(() => {
		fetchDpartments();
	}, [fetchDpartments]);

	useEffect(() => {
		// Name Arabic
		register("name", {
			required: t("error.form.required.nameArabic", { framework: "React" }),
		});

		// Name English
		register("nameEnglish", {
			required: t("error.form.required.nameEnglish", { framework: "React" }),
		});

		// Owner
		register("owner", {
			required: t("error.form.required.owner", { framework: "React" }),
		});

		// Section
		register("section", {
			required: t("error.form.required.section", { framework: "React" }),
		});

		if (data) {
			const {
				name,
				nameEnglish,
				owner,
				constructionYear,
				latitude,
				longitude,
				section,
			} = data;

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);

			const selectedOwner = ownerOptions.find((x) => x.value === owner?.id!);
			setValue("owner", selectedOwner!);

			setValue("constructionYear", constructionYear || "");
			setValue("latitude", latitude || "");
			setValue("longitude", longitude || "");

			const selectedSection = departmentOptions.find(
				(x) => x.value === section?.id!
			);
			setValue("section", selectedSection!);
		}
	}, [data, departmentOptions, ownerOptions, register, setValue, t]);

	const submitHandler = (values: ICivilDefenseBuildingFormInputs) => {
		onSubmit(values);
	};

	return (
		<ShadowedContainer className={styles.cdBuildingForm}>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.section}>
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
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<Dropdown
									label={t("cd.owner.name", { framework: "React" })}
									options={ownerOptions}
									onSelect={onChange}
									value={value}
								/>
							)}
							name="owner"
							control={control}
							// defaultValue={}
						/>
					</div>{" "}
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("cd.building.constructYear", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="constructionYear"
							control={control}
							defaultValue={""}
						/>
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("cd.building.latitude", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="latitude"
							control={control}
							defaultValue={""}
						/>
					</div>{" "}
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("cd.building.longitude", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="latitude"
							control={control}
							defaultValue={""}
						/>
					</div>
				</div>{" "}
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<Dropdown
									label={t("department.name", { framework: "React" })}
									options={departmentOptions}
									onSelect={onChange}
									value={value}
								/>
							)}
							name="section"
							control={control}
							// defaultValue={}
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
						<ErrorMessage
							errors={errors}
							name="owner"
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
							name="section"
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

export default CivilDefenseBuildingForm;
