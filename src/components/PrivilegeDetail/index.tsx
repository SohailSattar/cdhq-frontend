import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../utils/store';
import ShadowedContainer from '../ShadowedContainer';
import StatusIcon from '../StatusIcon';

import styles from './styles.module.scss';

interface Props {
	readPrivilege: boolean;
	insertPrivilege: boolean;
	updatePrivilege: boolean;
	deletePrivilege: boolean;
}

const PrivilegeDetail: FC<Props> = ({
	readPrivilege,
	insertPrivilege,
	updatePrivilege,
	deletePrivilege,
}) => {
	const [t] = useTranslation('common');

	return (
		<ShadowedContainer className={styles.privilegeDetail}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>{t('privilege.read', { framework: 'React' })}</th>
						<th>{t('privilege.insert', { framework: 'React' })}</th>
						<th>{t('privilege.update', { framework: 'React' })}</th>
						<th>{t('privilege.delete', { framework: 'React' })}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={styles.rowIcon}>
							<StatusIcon status={readPrivilege} />{' '}
						</td>
						<td className={styles.rowIcon}>
							<StatusIcon status={insertPrivilege} />
						</td>
						<td className={styles.rowIcon}>
							<StatusIcon status={updatePrivilege} />
						</td>
						<td className={styles.rowIcon}>
							<StatusIcon status={deletePrivilege} />{' '}
						</td>
					</tr>
				</tbody>
			</table>
		</ShadowedContainer>
	);
};

export default PrivilegeDetail;
