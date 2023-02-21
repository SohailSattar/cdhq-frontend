import { FC } from 'react';
import { APIPrivilege } from '../../../../api/privileges/type';
import { Button, Dropdown, PrivilegesChart } from '../../../../components';
import { DropdownOption } from '../../../../components/Dropdown';

import styles from './styles.module.scss';

interface Props {
	privilegesOptions: DropdownOption[];
	onPrivilegeSelect: (option: DropdownOption) => void;
	onUpdate: () => void;
	allPrivilegesList: APIPrivilege[];
}

const SetPrivilege: FC<Props> = ({
	privilegesOptions,
	onPrivilegeSelect,
	onUpdate,
	allPrivilegesList,
}) => {
	return (
		<div className={styles.setPrivilege}>
			<div>
				<div>
					<Dropdown options={privilegesOptions} onSelect={onPrivilegeSelect} />
				</div>
			</div>
			<div className={styles.row}>
				<PrivilegesChart data={allPrivilegesList} />
			</div>
			<div className={styles.row}>
				<Button onClick={onUpdate}>Update</Button>
			</div>
		</div>
	);
};

export default SetPrivilege;
