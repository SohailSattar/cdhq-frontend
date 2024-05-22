import { FC, useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IEmployeeContactInfoFormInputs } from "../../..";
import {
	Checkbox,
	DatePicker,
	Dropdown,
	ShadowedContainer,
	TextBox,
} from "../../../..";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../utils/store";

import styles from "../../styles.module.scss";
import clsx from "clsx";
import { DropdownOption } from "../../../../Dropdown";
import { Id } from "../../../../../utils";
import { getMoiActJobs } from "../../../../../api/moi/get/getMoiActJobs";

interface Props {
	canUpdate: boolean;
}

const ContactInfo: FC<Props> = ({ canUpdate }) => {
	const [t] = useTranslation("common");

	const {
		register,
		control,
		setValue,
		formState: { errors },
	} = useFormContext<IEmployeeContactInfoFormInputs>();

	return (
		<ShadowedContainer className={styles.basic}>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("emirate.name", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="residenceEmirate"
						control={control}
						defaultValue={""}
					/>
				</div>{" "}
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("common.city", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="residenceCity"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("common.area", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="residenceArea"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
			<div className={styles.row}>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={`* ${t("employee.phone", {
									framework: "React",
								})}`}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
								className={errors.phone ? styles.errorBorder : ""}
							/>
						)}
						name="phone"
						control={control}
						defaultValue={""}
					/>
				</div>{" "}
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.phone2", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="phone2"
						control={control}
						defaultValue={""}
					/>
				</div>
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("user.phoneOffice", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="phoneOffice"
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
								label={t("employee.emailLan", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="emailLan"
						control={control}
						defaultValue={""}
					/>
				</div>{" "}
				<div className={styles.field}>
					<Controller
						render={({ field: { value, onChange } }) => (
							<TextBox
								type="text"
								label={t("employee.emailNet", {
									framework: "React",
								})}
								value={value}
								onChange={onChange}
								disabled={!canUpdate}
							/>
						)}
						name="emailNet"
						control={control}
						defaultValue={""}
					/>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default ContactInfo;
