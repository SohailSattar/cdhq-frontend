import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ShadowedContainer from '../ShadowedContainer';
import StatusIcon from '../StatusIcon';

import { useStore } from '../../utils/store';

import { APIPrivilege } from '../../api/privileges/type';

import styles from './styles.module.scss';

export interface Props {
	data: APIPrivilege[];
}

const PrivilegesChart: FC<Props> = ({ data }) => {
	const [t] = useTranslation('common');
	const language = useStore((state) => state.language);

	return (
		<div>
			<ShadowedContainer className={styles.privilegesChart}>
				<table className={styles.table}>
					<tr>
						<th></th>
						<th>{t('privilege.read', { framework: 'React' })}</th>
						<th>Write</th>
						<th>Update</th>
						<th>Delete</th>
					</tr>
					{data.map((privilege, index) => (
						<tr key={index}>
							<td>
								{language !== 'ar' ? privilege.name : privilege.nameEnglish}
							</td>
							<td className={styles.rowIcon}>
								<StatusIcon status={privilege.readPrivilege} />{' '}
							</td>
							<td className={styles.rowIcon}>
								<StatusIcon status={privilege.insertPrivilege} />
							</td>
							<td className={styles.rowIcon}>
								<StatusIcon status={privilege.updatePrivilege} />
							</td>
							<td className={styles.rowIcon}>
								<StatusIcon status={privilege.deletePrivilege} />{' '}
							</td>
						</tr>
					))}
				</table>
			</ShadowedContainer>
		</div>
	);
};

export default PrivilegesChart;
