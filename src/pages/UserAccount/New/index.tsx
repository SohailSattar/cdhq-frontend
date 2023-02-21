import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getExistingEmployee } from '../../../api/employees/get/getExistingEmployee';
import { addUser } from '../../../api/users/add/addUser';
import { checkIfUserExists } from '../../../api/users/get/checkIfUserExists';
import { APINewUser, APIUserDetail } from '../../../api/users/types';
import { NotAuthorized } from '../../../components';
import { DropdownOption } from '../../../components/Dropdown';
import { useStore } from '../../../utils/store';

import * as RoutePath from '../../../RouteConfig';

import { ROLE } from '../../../utils';
import UserForm from '../../../components/Form/UserForm';
import { IUserFormInputs } from '../../../components/Form/types';
import { APIExistingEmployee } from '../../../api/employees/types';

const NewUserPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation('common');
	const navigate = useNavigate();
	const language = useStore((state) => state.language);

	const { role } = useStore((state) => state.loggedInUser);
	const [canView, setCanView] = useState(false);

	const [employeeExists, setEmployeeExists] = useState(true);

	const [employee, setEmployee] = useState<APIUserDetail>();

	const [employeeNumber, setEmployeeNumber] = useState<string>('');
	const [logName, setLogName] = useState<string>('');

	const [name, setName] = useState<string>('');
	const [nameEnglish, setNameEnglish] = useState<string>('');

	const [phone, setPhone] = useState<string>('');
	const [email, setEmail] = useState<string>('');

	const [selectedDepartment, setSelectedDepartment] =
		useState<DropdownOption>();

	const [selectedClass, setSelectedClass] =
		useState<DropdownOption | undefined | null>(null);

	const [selectedRank, setSelectedRank] = useState<DropdownOption>();

	const [password, setPassword] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');

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
						logName: '',
						employeeNo: empNo!,
						name,
						nameEnglish,
						phone: phone!,
						email: email!,
						department: department!,
						class: classDetail!,
						rank: rank!,
					});

					setEmployeeNumber(empNo.toString()!);

					// LogName is the combination of Class code + Employee Number
					const lname = classDetail?.logPre! + empNo;
					setLogName(lname);

					setName(name);
					setNameEnglish(nameEnglish!);

					let ddv: DropdownOption = {
						label:
							language !== 'ar' ? department!.name! : department!.nameEnglish!,
						value: department!.id!,
					};
					setSelectedDepartment(ddv);

					ddv = {
						label:
							language !== 'ar'
								? classDetail!.name!
								: classDetail!.nameEnglish!,
						value: classDetail!.id!,
					};
					setSelectedClass(ddv);

					ddv = {
						label: language !== 'ar' ? rank!.name! : rank!.nameEnglish!,
						value: rank!.id!,
					};
					setSelectedRank(ddv);
				}
			} else {
				setEmployeeExists(false);
			}
		};

		fetchData();
	}, [id, language, navigate, role]);

	const departmentSelectHandler = (option: DropdownOption) => {
		setSelectedDepartment(option);
	};

	const classDropdownSelectHandler = (option: DropdownOption) => {
		setSelectedClass(option);
	};

	const rankDropdownSelectHandler = (option: DropdownOption) => {
		setSelectedRank(option);
	};

	const addNewUserHandler = async (details: IUserFormInputs) => {
		const params: APINewUser = {
			...details,
			id: id!,
			departmentId: +details.department?.value!,
			classId: +details.userClass?.value!,
			rankId: +details.rank?.value!,
			password: details.password,
		};

		const { data } = await addUser(params);
		if (data?.success!) {
			toast.success(t('message.userAdded', { framework: 'React' }));
			navigate(`${RoutePath.USER}/${id}`);
		}

		if (data?.errors?.length! > 0) {
			data?.errors?.map((error: any) =>
				toast.error(error, { autoClose: 5000 })
			);
		}
	};

	return canView ? (
		<>
			<UserForm
				data={employee}
				isExistingEmployee={employeeExists}
				isNewUser={true}
				actionButtonText={t('button.save', { framework: 'React' })}
				onSubmit={addNewUserHandler}
			/>
		</>
	) : (
		<NotAuthorized />
	);
};

export default NewUserPage;
