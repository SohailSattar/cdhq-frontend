import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ShadowedContainer } from '../../../../../components';

import { useStore } from '../../../../../utils/store';

import { APIExistingUser } from '../../../../../api/users/types';

import styles from './styles.module.scss';

interface Props {
	detail: APIExistingUser;
	onClick: (detail: any) => void;
}

const ExistingUserDetails: FC<Props> = ({ detail, onClick }) => {
	const [t] = useTranslation('common');

	const language = useStore((state) => state.language);

	const selectButtonHandler = (e: any) => {
		onClick(e);
	};

	let name = '';

	if (language !== 'ar') {
		name = detail.name;
	} else {
		if (detail.nameEnglish) {
			name = detail.nameEnglish!;
		} else {
			name = detail.name;
		}
	}

	return (
		<ShadowedContainer>
			<div className={styles.details}>
				<div className={styles.detail}>
					<div>
						<div className={styles.heading}>
							{t('user.id', { framework: 'React' })}
						</div>
						<div>{detail.id}</div>
					</div>
					<div>
						<div className={styles.heading}>
							{t('user.logName', { framework: 'React' })}
						</div>
						<div>{detail.logName}</div>
					</div>
					<div>
						<div className={styles.heading}>
							{t('user.employeeNumber', { framework: 'React' })}
						</div>
						<div>{detail.employeeNo}</div>
					</div>
					<div>
						<div className={styles.heading}>
							{t('user.fullName', { framework: 'React' })}
						</div>
						<div>{name}</div>
					</div>
					<div>
						<div className={styles.heading}>
							{t('rank.name', { framework: 'React' })}
						</div>
						<div>
							{/* {detail?.hireDate !== null
								? format(new Date(detail?.hireDate!), 'dd MMMM yyyy', {
										locale: language !== 'ar' ? ar : enGB,
								  })
								: 'N/A'} */}
							{language !== 'ar'
								? detail.rank?.name!
								: detail.rank?.nameEnglish!}
						</div>
					</div>
					<div>
						{/* <div className={styles.heading}>
							{t('user.class', { framework: 'React' })}
						</div>
						<div>
							{language !== 'ar'
								? detail.class?.name!
								: detail.class?.nameEnglish!}
						</div> */}
					</div>
				</div>
				<div className={styles.buttonSection}>
					<Button onClick={() => selectButtonHandler(detail)}>
						{t('button.select', { framework: 'React' })}
					</Button>
				</div>
			</div>
		</ShadowedContainer>
	);
};

export default ExistingUserDetails;
