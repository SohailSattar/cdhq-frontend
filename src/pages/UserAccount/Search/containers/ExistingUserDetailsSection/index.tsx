import ExistingUserDetails from '../ExistingUserDetails';
import { FC } from 'react';

import styles from './styles.module.scss';
import { APIExistingUser } from '../../../../../api/users/types';

interface Props {
	list: APIExistingUser[];
	onClick: (e: any) => void;
}

const ExistingExployeeDetailsSection: FC<Props> = ({ list, onClick }) => {
	return (
		<div>
			{list.map((employee, index) => (
				<div className={styles.existingUser} key={index}>
					<ExistingUserDetails detail={employee} onClick={onClick} />
				</div>
			))}
		</div>
	);
};

export default ExistingExployeeDetailsSection;
