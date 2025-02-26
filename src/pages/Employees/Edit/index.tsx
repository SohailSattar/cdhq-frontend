import { Route, useNavigate, useParams } from "react-router-dom";
import {
	DeleteConfirmation,
	EmployeeForm,
	EmployeeFormData,
	EmployeeHistoryTable,
	MetaDataDetails,
	Modal,
	PageContainer,
} from "../../../components";
import * as RoutePath from "../../../RouteConfig";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
	APIEmployeeDetail,
	APIUpdateEmployee,
	APIUpdateEmployeePhoto,
} from "../../../api/employees/types";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { getEmployeeDetails } from "../../../api/employees/get/getEmployeeDetails";
import { Project } from "../../../data/projects";
import { APIPrivileges } from "../../../api/privileges/type";
import { updateEmployee } from "../../../api/employees/update/updateEmployee";
import { toast } from "react-toastify";
import { updateEmployeeImage } from "../../../api/employees/update/updateEmployeeImage";
import { getActiveStatus } from "../../../api/activeStatus/get/getActiveStatus";
import { APIStatus } from "../../../api";
import { updateEmployeeStatus } from "../../../api/employees/update/updateEmployeeStatus";
import { APIActiveStatus } from "../../../api/activeStatus/types";
import { ROLE } from "../../../utils";
import { checkPrivilegeForProjectUser } from "../../../api/userProjects/get/checkPrivilegeForProjectUser";

const EmployeeEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [lockPage, setLockPage] = useState<boolean>(false);

	const [isLoading, setisLoading] = useState<boolean>(true);

	const [employee, setEmployee] = useState<APIEmployeeDetail>();
	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const [serverErrors, setServerErrors] = useState<string[]>([]);

	const [status, setStatus] = useState<APIActiveStatus>();
	const [showHistoryModal, setShowHistoryModal] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const fetch = useMemo(
		() => async () => {
			// setisLoading(true);
			const { data: privilege } = await checkPrivilegeForProjectUser(
				id!,
				Project.Employees
			);
			if (privilege) {
				const {
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				} = privilege;

				setPrivileges({
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				});

				if (readPrivilege! !== false) {
					const { data } = await getEmployeeDetails(id!);

					if (data) {
						setEmployee(data);
						setStatus(data.activeStatus);
					}
				} else {
					const url = RoutePath.EMPLOYEE;
					navigate(url);
				}
			}
			setisLoading(false);
		},
		[id, navigate]
	);

	useEffect(() => {
		if (id) {
			fetch();
			setisLoading(false);
		}
	}, [id, fetch]);

	const editEmployeeHandler = async (values: EmployeeFormData) => {
		const {
			class: recruiter,
			rank,
			contractType,
			profession,
			nationality,
			nationalService,
			nationalServiceGroup,
			status,
			department,
			section,
			professionalTraining,
			workMode,
			workGroup,
			signList,
			actJob,
			assignedJob,
			militaryTrained,
			militaryWear,
			qualification,
			degreeCountry,
			gender,
			maritalStatus,
			religion,
			specialNeed,
			healthStatus,
			bloodType,
			...rest
		} = values;
		// departmentId: values.department.value,
		const params: APIUpdateEmployee = {
			id: id!,
			classId: recruiter.value,
			rankId: rank.value,
			contractTypeId: contractType.value,
			professionId: profession.value,
			nationalityId: nationality.value,
			nationalServiceId: nationalService.value,
			statusId: status.value,
			departmentId: department.value,
			sectionId: section.value,
			professionalTrainingId: professionalTraining.value,
			workModeId: workMode.value,
			workGroupId: workGroup.value,
			signListId: signList.value,
			actJobMOIId: actJob.value,
			assignedJobId: assignedJob.value,
			militaryTrainId: militaryTrained.value,
			militaryWearId: militaryWear.value,
			qualificationId: qualification.value,
			degreeCountryId: degreeCountry.value,
			genderId: gender.value,
			maritalStatusId: maritalStatus.value,
			religionId: religion.value,
			specialNeedId: specialNeed.value,
			healthStatusId: healthStatus.value,
			bloodTypeId: bloodType.value,
			...rest,
		};
		const { data, error } = await updateEmployee(params);
		if (data?.success) {
			toast.success(
				t("message.employeeUpdated", { framework: "React" }).toString()
			);
			navigate(
				RoutePath.EMPLOYEE_EDIT.replace(RoutePath.ID, data?.id!.toString())
			);
		} else {
			setServerErrors(data?.errors!);
		}
	};

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateEmployeePhoto = {
			id: id!,
			thumbnail: image,
		};

		const { data, error } = await updateEmployeeImage(params);
		if (data) {
			toast.success(
				t("message.imageUpdated", { framework: "React" }).toString()
			);
		}
	};

	const activateClickHandler = async () => {
		const statusCode = 1;

		const params: APIStatus = {
			id: id!,
			activeStatusId: 1,
		};

		const { data, error } = await updateEmployeeStatus(params);

		if (data) {
			const { data: status } = await getActiveStatus(statusCode);
			if (status) {
				setStatus(status);
			}

			toast.success(
				t("message.recordActivated", { framework: "React" }).toString()
			);
			setShowModal(false);
			navigate(`${RoutePath.EMPLOYEE}`);
		}

		if (error) {
			toast.error(error?.ErrorMessage);

			setServerErrors(error?.ErrorMessage);
		}
	};

	const deleteButtonClickHandler = () => {
		setShowModal(true);
	};

	const deleteConfirmationClickHandler = async () => {
		const statusCode = 9;

		const params: APIStatus = {
			id: id!,
			activeStatusId: 9,
		};

		const { data, error } = await updateEmployeeStatus(params);

		if (data) {
			const { data: status } = await getActiveStatus(statusCode);
			if (status) {
				setStatus(status);
			}

			toast.error(
				t("message.recordDeactivated", { framework: "React" }).toString()
			);
			setShowModal(false);
			navigate(`${RoutePath.EMPLOYEE}`);
		}

		if (error) {
			toast.error(error?.ErrorMessage);

			setServerErrors(error?.ErrorMessage);
		}
	};

	const deleteCancelHandler = () => {
		setShowModal(false);
	};

	const historyModalCloseHandler = () => {
		setShowHistoryModal(false);
	};

	return (
		<PageContainer
			title={t("page.employeeEdit", { framework: "React" })}
			showBackButton
			displayContent={privileges?.readPrivilege}
			btnBackUrlLink={RoutePath.EMPLOYEE}
			showChangeStatusButton={
				privileges?.privilegeId !== 999 && privileges?.updatePrivilege
			}
			currentStatus={status?.id === 1 ? "ACTIVE" : "DEACTIVE"}
			onDectivate={deleteButtonClickHandler}
			onActivate={activateClickHandler}
			loading={isLoading}
			showHistoryButton={true}
			onHistoryClick={() => setShowHistoryModal(true)}>
			<EmployeeForm
				data={employee}
				actionButtonText={t("button.update", {
					framework: "React",
				}).toString()}
				onSubmit={editEmployeeHandler}
				onImageUpload={imageUploadHandler}
				canUpdate={privileges?.updatePrivilege!}
				mode="UPDATE"
				serverErrors={serverErrors}
			/>
			<MetaDataDetails
				createdBy={employee?.createdBy!}
				createdOn={employee?.createdOn!}
				updatedBy={employee?.updatedBy}
				updatedOn={employee?.updatedOn}
			/>
			<Modal
				isOpen={showHistoryModal}
				onClose={historyModalCloseHandler}>
				<EmployeeHistoryTable id={+id!} />
			</Modal>
			<DeleteConfirmation
				isOpen={showModal}
				onYesClick={deleteConfirmationClickHandler}
				onCancelClick={deleteCancelHandler}
			/>
		</PageContainer>
	);
};

export default EmployeeEditPage;
