import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IEmployeeEmergencyContactInfoFormInputs } from "../../..";
import { DatePicker, Dropdown, ShadowedContainer, TextBox } from "../../../..";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../utils/store";

import styles from "../../styles.module.scss";

interface Props {
	canUpdate: boolean;
}

const EmergencyContactInfo: FC<Props> = ({ canUpdate }) => {
	const [t] = useTranslation("common");
	const language = useStore((state: { language: any }) => state.language);

	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<IEmployeeEmergencyContactInfoFormInputs>();

	return (
		<ShadowedContainer className={styles.basic}>
			<h4 className={styles.heading}>
				{t("employee.emergency.heading", {
					framework: "React",
				})}
			</h4>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.emergency.name", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={errors.emergencyCallName ? styles.errorBorder : ""}
							/>
						)}
						name="emergencyCallName"
						control={control}
						defaultValue={""}
					/>
				</div>{" "}
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.emergency.relation", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={
									errors.emergencyCallRelation ? styles.errorBorder : ""
								}
							/>
						)}
						name="emergencyCallRelation"
						control={control}
						defaultValue={""}
					/>
				</div>{" "}
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.emergency.phone", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={errors.emergencyCallPhone ? styles.errorBorder : ""}
							/>
						)}
						name="emergencyCallPhone"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.emergency.address", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={
									errors.emergencyCallAddress ? styles.errorBorder : ""
								}
							/>
						)}
						name="emergencyCallAddress"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>{" "}
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.emergency.name", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="emergencyOtherName"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.emergency.relation", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="emergencyOtherRelation"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.emergency.phone2", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="emergencyOtherPhone"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.emergency.address", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="emergencyOtherAddress"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default EmergencyContactInfo;
