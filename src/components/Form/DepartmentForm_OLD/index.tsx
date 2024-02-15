import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Id } from "react-toastify";
import { Button, Dropdown, ShadowedContainer, TextBox } from "../..";
import { DropdownOption } from "../../Dropdown";

import { getDepartmentLevels } from "../../../api/departmentLevel/get/getDepartmentLevels";
import { getEmirates } from "../../../api/emirates/get/getEmirates";

import { useStore } from "../../../utils/store";

import styles from "./styles.module.scss";
import { getCategorizedDepartments } from "../../../api/departments/get/getCategorizedDepartments";
import { APIDepartmentLevel } from "../../../api/departmentLevel/types";

interface Props {
	disableId?: boolean;
	id: string;
	setId?: Dispatch<SetStateAction<string>>;
	name: string;
	setName: Dispatch<SetStateAction<string>>;
	nameEnglish: string;
	setNameEnglish: Dispatch<SetStateAction<string>>;
	selectedLevelOption: DropdownOption;
	setSelectedLevelOption: Dispatch<SetStateAction<DropdownOption | undefined>>;
	fullName: string;
	setFullName: Dispatch<SetStateAction<string>>;
	fullNameEnglish: string;
	setFullNameEnglish: Dispatch<SetStateAction<string>>;
	selectedEmirate: DropdownOption;
	setSelectedEmirate: Dispatch<SetStateAction<DropdownOption | undefined>>;
	selectedParentDepartment?: DropdownOption;
	setSelectedPatrentDepartment?: Dispatch<
		SetStateAction<DropdownOption | undefined>
	>;
	actionButtonText: string;
	onActionClick: () => void;
}

const DepartmentForm_OLD: FC<Props> = ({
	disableId = false,
	id,
	setId = () => {},
	name,
	setName,
	nameEnglish,
	setNameEnglish,
	selectedLevelOption,
	setSelectedLevelOption,
	fullName,
	setFullName,
	fullNameEnglish,
	setFullNameEnglish,
	selectedEmirate,
	setSelectedEmirate,
	selectedParentDepartment,
	setSelectedPatrentDepartment = () => {},
	actionButtonText,
	onActionClick,
}) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const [levelOptions, setLevelOptions] = useState<DropdownOption[]>([]);

	const [levels, setLevels] = useState<APIDepartmentLevel[]>([]);

	// const [selectedLevelOption, setSelectedLevelOption] =
	// 	useState<DropdownOption>();

	const [departments, setDepartments] = useState<DropdownOption[]>([]);

	const [emirates, setEmirates] = useState<DropdownOption[]>([]);
	// const [selectedEmirate, setSelectedEmirate] = useState<DropdownOption>();

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentLevels();

			if (data) {
				setLevelOptions(
					data.map((x) => ({
						label: language !== "ar" ? x.name : x.nameEnglish,
						value: x.id,
					}))
				);
				setLevels(data);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getCategorizedDepartments();

			if (data) {
				setDepartments(
					data.map((x) => ({
						label: x.fullName,
						value: x.id,
					}))
				);
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getEmirates();

			if (data) {
				if (language !== "ar") {
					const options = data.map((x) => ({ label: x.name, value: x.id }));
					setEmirates(options);
				} else {
					const options = data.map((x) => ({
						label: x.nameEnglish,
						value: x.id,
					}));
					setEmirates(options);
				}
			}
		};

		fetch();
	}, [language]);

	useEffect(() => {
		let value: Id;

		//	Level
		value = selectedLevelOption?.value!;
		// setSelectedLevelOption(levels.find((x) => x.value === value));
	}, [levels, selectedLevelOption, setSelectedLevelOption]);

	const idChangeHandler = (e: any) => {
		const text = e.target.value;
		setId(text);
	};

	const nameChangeHandler = (e: any) => {
		const text = e.target.value;

		//If Level Code is selected then set the name to the full name
		const levelCode = selectedLevelOption
			? levels.find((x) => x.id === selectedLevelOption!.value!)!.name!
			: "";

		setName(text);
		setFullName(text + " " + levelCode);
	};

	const nameEnglishChangeHandler = (e: any) => {
		const text = e.target.value;
		//If Level Code is selected then set the name to the full name
		const levelCode = selectedLevelOption
			? levels.find((x) => x.id === selectedLevelOption!.value!)!.nameEnglish!
			: "";

		setNameEnglish(text);
		setFullNameEnglish(text + " " + levelCode);
	};

	const levelOptionChangeHandler = (option: DropdownOption) => {
		setSelectedLevelOption(option);

		if (name !== "") {
			const level = levels.find((x) => x.id === option.value)?.name;
			setFullName(name + " " + level);
		}

		if (nameEnglish !== "") {
			const level = levels.find((x) => x.id === option.value)?.nameEnglish;
			setFullNameEnglish(nameEnglish + " " + level);
		}
	};

	const emirateSelectHandler = (option: DropdownOption) => {
		setSelectedEmirate(option);
	};

	const parentDepartmentSelectHandler = (option: DropdownOption) => {
		setSelectedPatrentDepartment(option);
	};

	return (
		<div className={styles.form}>
			<ShadowedContainer>
				<div className={styles.section}>
					<div className={styles.field}>
						<TextBox
							label={"ID"}
							value={id}
							type="text"
							onChange={idChangeHandler}
							disabled={disableId}
						/>
					</div>
					<div className={styles.field}>
						<TextBox
							label={t("global.name", { framework: "React" })}
							value={name}
							type="text"
							onChange={nameChangeHandler}
						/>
					</div>
					<div className={styles.field}>
						<TextBox
							label={t("global.nameEnglish", { framework: "React" })}
							value={nameEnglish}
							type="text"
							onChange={nameEnglishChangeHandler}
						/>
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.field}>
						<Dropdown
							label="Level"
							options={levelOptions}
							value={selectedLevelOption}
							onSelect={levelOptionChangeHandler}
						/>
					</div>
					<div className={styles.field}>
						<TextBox
							label={t("department.fullName", { framework: "React" })}
							value={fullName}
							type="text"
							// onChange={() => {}}
							disabled
						/>
					</div>
					<div className={styles.field}>
						<TextBox
							label={t("department.fullNameEnglish", { framework: "React" })}
							value={fullNameEnglish}
							type="text"
							// onChange={() => {}}
							disabled
						/>
					</div>
				</div>
				<div className={styles.section}>
					<div className={styles.field}>
						<Dropdown
							label={t("emirate.name", { framework: "React" })}
							options={emirates}
							value={selectedEmirate}
							onSelect={emirateSelectHandler}
						/>
					</div>
					<div className={styles.field}>
						<Dropdown
							label={t("department.parent", { framework: "React" })}
							options={departments}
							value={selectedParentDepartment}
							onSelect={parentDepartmentSelectHandler}
						/>
					</div>
				</div>
			</ShadowedContainer>
			<ShadowedContainer className={styles.section}>
				<div className={styles.buttonSection}>
					<div className={styles.btn}>
						<Button onClick={onActionClick}>{actionButtonText}</Button>
					</div>
				</div>
			</ShadowedContainer>
		</div>
	);
};

export default DepartmentForm_OLD;
