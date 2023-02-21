import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDepartmentDetail } from '../../../api/departments/get/getDepartmentDetail';
import { APIDepartmentDetail } from '../../../api/departments/types';
import Layout from '../container/Layout';
import DepartmentDetail from './container/DepartmentDetail';
import { Button, ShadowedContainer } from '../../../components';

import * as RoutePath from '../../../RouteConfig';

const DepartmentDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [department, setDepartment] = useState<APIDepartmentDetail>();

	useEffect(() => {
		if (!id) {
			navigate(RoutePath.DEPARTMENT);
		}

		const fetchData = async () => {
			const { data, error } = await getDepartmentDetail(id!);

			if (error) {
				if (error.response.status === 401) {
					navigate(RoutePath.LOGIN);
				}
			}

			if (data) {
				setDepartment(data);
			}
		};

		fetchData();
	}, [id, navigate]);

	const editDepartmentClickHandler = () => {
		navigate(`${RoutePath.DEPARTMENT}/${id}/edit`);
	};

	return (
		<Layout>
			<ShadowedContainer>
				<Button onClick={editDepartmentClickHandler}>Edit</Button>
			</ShadowedContainer>
			<DepartmentDetail detail={department!} />
		</Layout>
	);
};

export default DepartmentDetailPage;
