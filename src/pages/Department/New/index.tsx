import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownOption } from "../../../components/Dropdown";
import {
	DepartmentForm,
	IDepartmentFormInputs,
	PageContainer,
} from "../../../components";

import * as RoutePath from "../../../RouteConfig";
import { ROLE } from "../../../utils";
import { APICreateDepartment } from "../../../api/departments/types";
import { addDepartment } from "../../../api/departments/add/addDepartment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NewDepartmentPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const submitHandler = async (values: IDepartmentFormInputs) => {
		const {
			name,
			nameEnglish,
			level,
			emirate,
			parent,
			status,
			operator,
			group,
			cdBuilding,
			moiDeptId,
		} = values;

		const params: APICreateDepartment = {
			name: name,
			nameEnglish: nameEnglish,
			levelId: level?.value!,
			regionId: emirate?.value!,
			parentId: parent?.value!,
			statusId: status?.value!,
			operatorId: operator?.value!,
			groupId: group?.value !== "" ? group?.value! : undefined,
			cdBuildingId: cdBuilding?.value !== "" ? cdBuilding?.value! : undefined,
			moiDeptId: moiDeptId || undefined,
		};

		const { data } = await addDepartment(params);
		if (data) {
			toast.success(
				t("message.departmentCreated", { framework: "React" }).toString()
			);
			navigate(`${RoutePath.DEPARTMENT}/${data.id}/edit`);
		}
	};

	return (
		<PageContainer
			title={t("page.departmentNew", { framework: "React" })}
			showBackButton
			btnBackUrlLink={RoutePath.DEPARTMENT}
			lockFor={[ROLE.ADMIN, ROLE.USER]}>
			<DepartmentForm
				actionButtonText={t("button.add", { framework: "React" }).toString()}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default NewDepartmentPage;
