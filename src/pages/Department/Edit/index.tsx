import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getDepartmentDetail } from "../../../api/departments/get/getDepartmentDetail";
import {
	DeleteConfirmation,
	DepartmentForm,
	IDepartmentFormInputs,
	MetaDataDetails,
	PageContainer,
	RedirectButton,
	ShadowedContainer,
} from "../../../components";
import { DropdownOption } from "../../../components/Dropdown";
import { useStore } from "../../../utils/store";
import * as RoutePath from "../../../RouteConfig";
import {
	APIDepartmentDetail,
	APIUpdateDepartment,
} from "../../../api/departments/types";
import { ROLE } from "../../../utils";
import { deleteDepartment } from "../../../api/departments/delete/deleteDepartment";
import { updateDepartment } from "../../../api/departments/update/updateDepartment";
import { toast } from "react-toastify";

const DepartmentEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [showModal, setShowModal] = useState(false);

	const [dept, setDept] = useState<APIDepartmentDetail>();

	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentDetail(id!);

			if (data) {
				setDept(data!);
			}
		};
		fetch();
	}, [id, language]);

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
		} = values;

		const params: APIUpdateDepartment = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			levelId: level?.value!,
			regionId: emirate?.value!,
			parentId: parent?.value!,
			statusId: status?.value!,
			operatorId: operator?.value!,
			groupId: group?.value !== "" ? group?.value! : undefined,
			cdBuildingId: cdBuilding?.value !== "" ? cdBuilding?.value! : undefined,
		};

		const { data } = await updateDepartment(params);
		if (data) {
			toast.success(
				t("message.departmentUpdated", { framework: "React" }).toString()
			);
		}
	};

	const deleteButtonClickHandler = () => {
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = async () => {
		//const statusCode = 9;

		const { data, error } = await deleteDepartment(id!);
		if (error) {
			toast.error(error.ErrorMessage);
		}

		if (data) {
			// projects.find((x) => x.id === +selectedProjectId)?.activeStatus;

			// setProjects(projects.filter((p) => p.id !== +selectedProjectId));
			// fetchProjects(id);

			if (data.success === false) {
				setErrors(data.errors!);
			} else {
				toast.success(
					t("message.userProjectDeleted", { framework: "React" }).toString()
				);
			}
		}
		setShowModal(false);
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	return (
		<PageContainer
			showBackButton
			btnBackUrlLink={RoutePath.DEPARTMENT}
			showChangeStatusButton
			currentStatus={dept?.activeStatus?.id === 1 ? "ACTIVE" : "DEACTIVE"}
			// onActivate={activateButtonClickHandler}
			onDectivate={deleteButtonClickHandler}
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			errors={errors}>
			<DepartmentForm
				data={dept}
				actionButtonText={t("button.update", { framework: "React" }).toString()}
				onSubmit={submitHandler}
			/>{" "}
			<MetaDataDetails
				createdBy={dept?.createdBy!}
				createdOn={dept?.createdOn!}
				updatedBy={dept?.updatedBy}
				updatedOn={dept?.updatedOn}
			/>
			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</PageContainer>
	);
};

export default DepartmentEditPage;
