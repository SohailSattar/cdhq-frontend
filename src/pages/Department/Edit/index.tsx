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
	APIUpdateDepartmentStatus,
} from "../../../api/departments/types";
import { ROLE } from "../../../utils";
import { deleteDepartment } from "../../../api/departments/delete/deleteDepartment";
import { updateDepartment } from "../../../api/departments/update/updateDepartment";
import { toast } from "react-toastify";
import { updateDepartmentStatus } from "../../../api/departments/update/updateDepartmentStatus";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { APIActiveStatus } from "../../../api/activeStatus/types";

const DepartmentEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	const [showModal, setShowModal] = useState(false);

	const [dept, setDept] = useState<APIDepartmentDetail>();
	const [status, setStatus] = useState<APIActiveStatus>();

	const [errors, setErrors] = useState<string[]>([]);

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getDepartmentDetail(id!);

			if (data) {
				setDept(data!);
				setStatus(data?.activeStatus);
				setErrors([
					"Cannot delete the department.",
					"Employees are assigned to this department.",
				]);
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

	const activateButtonClickHandler = async () => {
		const statusCode = 1;

		const params: APIUpdateDepartmentStatus = {
			id: id!,
			activeStatusId: statusCode,
		};

		const { data } = await updateDepartmentStatus(params);
		if (data) {
			const { data: status } = await getActiveStatus(statusCode);

			if (status) {
				setStatus(status);
			}
		}

		toast.success(
			t("message.projectActivated", { framework: "React" }).toString()
		);
		setShowModal(false);
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
			if (data.success === false) {
				setErrors(data.errors!);
			} else {
				const { data: status } = await getActiveStatus(9);
				if (status) {
					setStatus(status);
				}
				toast.success(
					t("message.departmentDeactivated", { framework: "React" }).toString()
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
			currentStatus={status?.id === 1 ? "ACTIVE" : "DEACTIVE"}
			onActivate={activateButtonClickHandler}
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
