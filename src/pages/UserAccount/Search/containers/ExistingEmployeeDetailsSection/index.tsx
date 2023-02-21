import { FC } from 'react';
import ExistingEmployeeDetails from '../ExistingEmployeeDetails';

import { APIEmployee } from '../../../../../api/employees/types';

import styles from './styles.module.scss';

interface Props {
	list: APIEmployee[];
	onClick: (e: any) => void;
}

const ExistingExployeeDetailsSection: FC<Props> = ({ list, onClick }) => {
	return (
		<div>
			{list.map((employee, index) => (
				<div className={styles.existingUser} key={index}>
					<ExistingEmployeeDetails detail={employee} onClick={onClick} />
				</div>
			))}
		</div>
	);
};

export default ExistingExployeeDetailsSection;
