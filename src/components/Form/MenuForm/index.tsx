import _ from "lodash/fp";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { IMenuFormInputs } from "../types";
import { APIMenuItem, APIMenuItemDetail } from "../../../api/menu/types";

import styles from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import { Button, Checkbox, Dropdown, ShadowedContainer, TextBox } from "../..";
import { ErrorMessage } from "@hookform/error-message";
import { DropdownOption } from "../../Dropdown";
import { getAllMenuList } from "../../../api/menu/get/getAllMenuList";

interface Props {
	data?: APIMenuItemDetail;
	actionButtonText: string;
	onSubmit: (data: IMenuFormInputs) => void;
}

const MenuForm: FC<Props> = ({ data, actionButtonText, onSubmit }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [menuOptions, setMenuOptions] = useState<DropdownOption[]>([]);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		control,
	} = useForm<IMenuFormInputs>({ criteriaMode: "all" });

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await getAllMenuList();
			if (data) {
				setMenuOptions(
					data?.map((d) => {
						return {
							label: `${d.name}  -  ${d.nameEnglish}`,
							value: d.id,
						};
					})
				);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		// Employee Name
		register("name", {
			required: "Name is required.",
		});

		// Employee Name [English]
		register("nameEnglish", {
			required: "Name [English] is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		if (data) {
			const { name, nameEnglish, parent, linkPath, isVisible, orderNo } = data;

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);

			const selectedParent = menuOptions.find((x) => x.value === parent?.id);

			setValue("parentProject", selectedParent);
			setValue("linkPath", linkPath ?? "");
			setValue("isVisible", isVisible);
			setValue("orderNo", orderNo ?? "");
		}
	}, [data, menuOptions, register, setValue]);

	const submitHandler = (values: IMenuFormInputs) => {
		onSubmit(values);
	};

	return (
		<ShadowedContainer className={styles.menuForm}>
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
					<div className={styles.dropDownContainer}>
						<Controller
							render={({ field: { onChange, value } }) => (
								<Dropdown
									label={t("menu.parent", { framework: "React" })}
									options={menuOptions}
									onSelect={onChange}
									value={value}
								/>
							)}
							name="parentProject"
							control={control}
							defaultValue={{ label: "", value: "" }}
						/>
					</div>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("menu.pathLink", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="linkPath"
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
									label={t("menu.orderNo", { framework: "React" })}
									value={value}
									onChange={onChange}
								/>
							)}
							name="orderNo"
							control={control}
							defaultValue={""}
						/>
					</div>
					<div className={styles.dropDownContainer}>
						<Controller
							render={({ field: { onChange, value } }) => (
								<Checkbox
									label={t("menu.isVisible", { framework: "React" })}
									checked={value}
									onChange={onChange}
								/>
							)}
							name="isVisible"
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
						{/* <ErrorMessage
							errors={errors}
							name="department"
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
						/> */}
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

export default MenuForm;
