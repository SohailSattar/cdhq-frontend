import clsx from 'clsx';
import { FC } from 'react';
import { ShadowedContainer } from '..';
import { APIActiveStatus } from '../../api/activeStatus/types';
import { useStore } from '../../utils/store';

import styles from './styles.module.scss';

interface Props {
	status: APIActiveStatus;
}

const Status: FC<Props> = ({ status }) => {
	const language = useStore((state) => state.language);
	return (
		<ShadowedContainer>
			<div className={styles.status}>
				<div
					className={clsx(
						styles.text,
						status?.id === 7 || status?.id === 1
							? styles.active
							: styles.deactive
					)}>
					{language !== 'ar' ? status?.nameArabic! : status?.nameEnglish!}
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default Status;
