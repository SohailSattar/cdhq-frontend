import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "../../../utils/store";
import {
	UserForm,
	IUserFormInputs,
	NotAuthorized,
	PageContainer,
	Modal,
	UserPreview,
} from "../../../components";

import { APINewUser, APIUserDetail } from "../../../api/users/types";
import { getExistingEmployee } from "../../../api/employees/get/getExistingEmployee";
import { checkIfUserExists } from "../../../api/users/get/checkIfUserExists";
import { addUser } from "../../../api/users/add/addUser";

import * as RoutePath from "../../../RouteConfig";

import { ROLE } from "../../../utils";

const UserNewPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");
	const navigate = useNavigate();
	const language = useStore((state) => state.language);

	const { role } = useStore((state) => state.loggedInUser);
	const [canView, setCanView] = useState(false);

	const [employeeExists, setEmployeeExists] = useState(true);

	const [employee, setEmployee] = useState<APIUserDetail>();

	const [details, setDetails] = useState<IUserFormInputs>();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const previewHandler = async (values: IUserFormInputs) => {
		setDetails(values);
		setIsOpen(true);
	};

	useEffect(() => {
		if (role === ROLE.SUPERADMIN) {
			setCanView(true);
		}

		const fetchData = async () => {
			if (id) {
				const { data: isExist } = await checkIfUserExists(id!);

				if (isExist) {
					navigate(`${RoutePath.USER}/${id}/edit`);
				}

				const { data } = await getExistingEmployee(id!);
				if (data) {
					const {
						id,
						employeeNo: empNo,
						fullName: name,
						nameEnglish,
						phone,
						email,
						department,
						class: classDetail,
						rank,
					} = data;

					setEmployeeExists(true);

					setEmployee({
						id: id,
						logName: "",
						employeeNo: empNo!,
						name,
						nameEnglish,
						phone: phone!,
						email: email!,
						department: department!,
						class: classDetail!,
						rank: rank!,
						createdBy: "",
						createdOn: "",
						updatedBy: "",
						updatedOn: "",
					});
				}
			} else {
				setEmployeeExists(false);
			}
		};

		fetchData();
	}, [id, language, navigate, role]);

	const submitHandler = async () => {
		const {
			employeeNo,
			logName,
			name,
			nameEnglish,
			phone,
			email,
			department,
			userClass,
			rank,
			password,
		} = details!;

		const params: APINewUser = {
			...details,
			id: id!,
			employeeNo: employeeNo,
			logName: logName,
			name: name,
			nameEnglish: nameEnglish,
			phone: phone,
			email: email,
			departmentId: +department?.value!,
			classId: +userClass?.value!,
			rankId: +rank?.value!,
			password: password,
		};

		const { data } = await addUser(params);
		if (data?.success!) {
			toast.success(t("message.userAdded", { framework: "React" }).toString());
			navigate(`${RoutePath.USER}/${id}`);
		}

		if (data?.errors?.length! > 0) {
			data?.errors?.map((error: any) =>
				toast.error(error, { autoClose: 5000 })
			);
		}
	};

	return (
		<PageContainer
			showBackButton
			btnBackUrlLink={RoutePath.USER}>
			<UserForm
				data={employee}
				isExistingEmployee={employeeExists}
				isNewUser={true}
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={previewHandler}
			/>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}>
				<UserPreview
					data={details!}
					onClick={submitHandler}
				/>
			</Modal>
		</PageContainer>
	);
};

export default UserNewPage;
