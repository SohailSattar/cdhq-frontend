import _ from "lodash/fp";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { IMenuFormInputs } from "../types";
import { APIMenuItem, APIMenuItemDetail } from "../../../api/menu/types";

import styles from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import { Button, Dropdown, ShadowedContainer, TextBox } from "../..";
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

	const submitHandler = (values: IMenuFormInputs) => {
		onSubmit(values);
	};

	return (
		<ShadowedContainer>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className={styles.menuForm}>
					<div className={styles.row}>
						<div className={styles.basic}>
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
											multiline={true}
											maxRows={20}
										/>
									)}
									name="nameEnglish"
									control={control}
									defaultValue={""}
								/>
							</div>
							<div className={styles.ddlField}>
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
								/>
							</div>
							<div className={styles.row}>
								<div className={styles.actions}>
									<div
										className={language !== "ar" ? styles.btn : styles.btnLTR}>
										<Button type="submit">{actionButtonText}</Button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div>
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
									name="title"
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
					</div>
				</div>
			</form>
		</ShadowedContainer>
	);
};

export default MenuForm;
