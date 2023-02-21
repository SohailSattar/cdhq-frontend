import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
	Button,
	DepartmentTree,
	ShadowedContainer,
} from '../../../../components';

import * as RoutePath from '../../../../RouteConfig';

import styles from './styles.module.scss';

interface Props {
	hideNew?: boolean;
	children: any;
}

const Layout: FC<Props> = ({ hideNew = false, children }) => {
	const [t] = useTranslation('common');

	const navigate = useNavigate();

	const newDepartmentClickHandler = () => {
		navigate(`${RoutePath.DEPARTMENT}/new`);
	};

	const departmentNodeClickHandler = (id: any) => {
		navigate(`${RoutePath.DEPARTMENT}/${id}`);
	};

	return (
		<div className={styles.layout}>
			{!hideNew && (
				<div>
					<ShadowedContainer className={styles.section}>
						<div className={styles.actions}>
							<div className={styles.btn}>
								<Button onClick={newDepartmentClickHandler}>
									{t('button.addNewDepartment', { framework: 'React' })}
								</Button>
							</div>
						</div>
					</ShadowedContainer>
				</div>
			)}
			<div className={styles.container}>
				<div>
					<DepartmentTree
						onNodeCheck={departmentNodeClickHandler}
						showCheckbox={false}
					/>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
};

export default Layout;
