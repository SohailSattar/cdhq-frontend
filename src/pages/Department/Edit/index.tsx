import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getDepartmentDetail } from "../../../api/departments/get/getDepartmentDetail";
import {
	DepartmentForm,
	RedirectButton,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { useStore } from "../../../utils/store";
import * as RoutePath from "../../../RouteConfig";

const DepartmentEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);
	const [name, setName] = useState("");
	const [selectedLevel, setSelectedLevel] = useState<DropdownOption>();
	const [fullName, setFullName] = useState("");
	const [fullNameEnglish, setFullNameEnglish] = useState("");

	const [nameEnglish, setNameEnglish] = useState("");

	const [selectedEmirate, setSelectedEmirate] = useState<DropdownOption>();
	const [selectedParentDept, setSelectedParentDept] =
		useState<DropdownOption>();

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentDetail(id!);

			if (data) {
				setName(data?.name!);
				setNameEnglish(data?.nameEnglish!);

				// Full Name
				setFullName(data?.fullName);
				setFullNameEnglish(data?.fullNameEnglish!);

				// Department Level
				const level = data?.level;
				if (level) {
					const levelName =
						language !== "ar" ? level?.name : level?.nameEnglish!;
					setSelectedLevel(
						(prevState) => (prevState = { label: levelName, value: level?.id! })
					);
				}

				// Emirate
				const emirate = data?.emirate;
				const emirateName =
					language !== "ar" ? emirate?.name : emirate?.nameEnglish!;
				setSelectedEmirate({ label: emirateName, value: emirate.id });

				// Parent Department
				setSelectedParentDept({
					label: data?.parent.longFullName,
					value: data?.parent.id,
				});
			}
		};
		fetch();
	}, [id, language]);

	// useEffect(() => {
	// 	if (language !== 'ar') {
	// 		setName(nameArabic);
	// 	} else {
	// 		setName(nameEnglish);
	// 	}
	// }, [language, nameArabic, nameEnglish]);

	const editClickHandler = async () => {
		// const params: APIUpdateDepartment = {
		// 	id: +id!,
		// 	name: name,
		// 	nameEnglish: nameEnglish,
		// 	levelId: +selectedLevel?.value!,
		// 	emirateId: +selectedEmirate?.value!,
		// 	parentId: +selectedParentDept?.value!,
		// };
		// const { data } = await updateDepartment(params);
		// console.log(data);
	};

	return (
		<>
			<ShadowedContainer>
				<RedirectButton
					label="Back to details"
					redirectTo={RoutePath.DEPARTMENT}
				/>
			</ShadowedContainer>
			<DepartmentForm
				disableId
				id={id!}
				name={name}
				setName={setName}
				nameEnglish={nameEnglish}
				setNameEnglish={setNameEnglish}
				selectedLevelOption={selectedLevel!}
				setSelectedLevelOption={setSelectedLevel}
				fullName={fullName}
				setFullName={setFullName}
				fullNameEnglish={fullNameEnglish}
				setFullNameEnglish={setFullNameEnglish}
				selectedEmirate={selectedEmirate!}
				setSelectedEmirate={setSelectedEmirate}
				selectedParentDepartment={selectedParentDept}
				setSelectedPatrentDepartment={setSelectedParentDept}
				actionButtonText={t("button.update", { framework: "React" })}
				onActionClick={editClickHandler}
			/>
		</>
	);
};

export default DepartmentEditPage;
