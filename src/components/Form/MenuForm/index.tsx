import _ from "lodash/fp";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";
import { IMenuFormInputs } from "../types";
import { APIMenuItem, APIMenuItemDetail } from "../../../api/menu/types";

import styles from "./styles.module.scss";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Checkbox, Dropdown, ShadowedContainer, TextBox } from "../..";
import { ErrorMessage } from "@hookform/error-message";
import { DropdownOption } from "../../Dropdown";
import { getAllMenuList } from "../../../api/menu/get/getAllMenuList";
import { getLinkTypes } from "../../../api/linkTypes/get/getLinkTypes";
import { getFullPath } from "../../../utils";

interface Props {
	data?: APIMenuItemDetail;
	actionButtonText: string;
	onSubmit: (data: IMenuFormInputs) => void;
}

const MenuForm: FC<Props> = ({ data, actionButtonText, onSubmit }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [menuOptions, setMenuOptions] = useState<DropdownOption[]>([]);
	const [typesOptions, setTypesOptions] = useState<DropdownOption[]>([]);

	const [isFile, setIsFile] = useState<boolean>(false);

	const [isLinkPathDisabled, setIsLinkPathDisabled] = useState<boolean>(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
		setValue,
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
		const fetch = async () => {
			const { data } = await getLinkTypes();
			if (data) {
				setTypesOptions(
					data?.map((d) => {
						return {
							label: language !== "ar" ? d.name : d.nameEnglish,
							value: d.id,
							meta: {
								isFile: d.isFile,
								linkType: d.nameEnglish,
							},
						};
					})
				);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		// Menu Name
		register("name", {
			required: "Name is required.",
		});

		// Menu Name [English]
		register("nameEnglish", {
			required: "Name [English] is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		// Menu Name [English]
		register("linkType", {
			required: "Link Type is required.",
			// pattern: {
			// 	value: /[\u0621-\u064As]+$/,
			// 	message: 'Name should only be in alphabets.',
			// }
		});

		if (data) {
			const {
				name,
				nameEnglish,
				parent,
				linkPath,
				isVisible,
				orderNo,
				linkType,
				isExternalPath,
			} = data;

			setValue("name", name);
			setValue("nameEnglish", nameEnglish);

			const selectedParent = menuOptions.find((x) => x.value === parent?.id);

			setValue("parentProject", selectedParent);
			setValue("linkPath", linkPath ?? "");
			setValue("isVisible", isVisible);
			setValue("orderNo", orderNo ?? "");

			const selectedType = typesOptions.find((x) => x.value === linkType?.id);

			setValue("linkType", selectedType!);

			if (selectedType?.value !== 4) {
				setValue("isExternalLink", false);
			}

			if (selectedType) {
				const { isFile } = selectedType.meta;

				setIsFile(isFile);

				if (isFile) {
					setValue("linkPath", linkPath);
					setIsLinkPathDisabled(true);
				} else {
					setValue("file", undefined);
					setValue("linkPath", linkPath);
					setIsLinkPathDisabled(false);
				}
			}

			// setValue("isExternalLink", isExternalPath);
		}
	}, [data, menuOptions, register, setValue, typesOptions]);

	const linkTypeChangeHandler = (option: DropdownOption) => {
		setIsLinkPathDisabled(false);
		if (option !== null) {
			if (option.value === 4) {
				setValue("isExternalLink", true);
			} else {
				setValue("isExternalLink", false);
			}

			const { isFile } = option.meta;

			setIsFile(isFile);

			if (isFile) {
				setValue("linkPath", "");
			} else {
				setValue("file", undefined);
			}
		}
		setValue("linkType", option);
	};

	const fileChangeHandler = (evnt: ChangeEvent<HTMLInputElement>) => {
		if (evnt.target.files) {
			const file = evnt.target.files[0];

			const fileName = file.name;
			setValue("file", file);
			setValue("linkPath", fileName);
		}
	};

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
					<div className={styles.dropDownContainer}>
						<Controller
							render={({ field: { value } }) => (
								<Dropdown
									label={t("menu.linkType", { framework: "React" })}
									options={typesOptions}
									onSelect={linkTypeChangeHandler}
									value={value}
								/>
							)}
							name="linkType"
							control={control}
							defaultValue={{ label: "", value: "" }}
						/>
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.field}>
						<Controller
							render={({ field: { value, onChange } }) => (
								<TextBox
									type="text"
									label={t("menu.pathLink", { framework: "React" })}
									value={value}
									onChange={onChange}
									disabled={isLinkPathDisabled}
								/>
							)}
							name="linkPath"
							control={control}
							defaultValue={""}
						/>
					</div>
					{isFile && (
						<div className={styles.field}>
							<div className={styles.browse}>
								<input
									type="file"
									name="thumbnail"
									onChange={fileChangeHandler}
									accept="application/pdf, video/mp4"
								/>
							</div>
						</div>
					)}
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
						<Controller
							render={({ field: { onChange, value } }) => (
								<Checkbox
									label={t("menu.isExternal", { framework: "React" })}
									checked={value}
									onChange={onChange}
									disabled={true}
								/>
							)}
							name="isExternalLink"
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
						<ErrorMessage
							errors={errors}
							name="linkType"
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

export default MenuForm;
