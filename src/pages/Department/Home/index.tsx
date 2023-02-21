import { useTranslation } from 'react-i18next';
import { Button, ShadowedContainer } from '../../../components';
import Layout from '../container/Layout';
import { DepartmentListTable } from './containers';
import styles from './styles.module.scss';

const DepartmentHomePage = () => {
	const departmentSearchClickHandler = () => {};

	const data: any = { rows: [], columns: [] };

	return (
		<Layout>
			<div>
				sss
				<div className={styles.content}>
					<div className={styles.table}>
						{/* <DepartmentListTable
					data={data}
					onUserSearch={departmentSearchClickHandler}
				/> */}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default DepartmentHomePage;
