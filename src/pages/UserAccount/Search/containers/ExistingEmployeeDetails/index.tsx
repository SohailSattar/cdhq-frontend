import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { format } from 'date-fns';
import { enGB, ar } from 'date-fns/locale';

import { useStore } from '../../../../../utils/store';
import { Button, ShadowedContainer } from '../../../../../components';

import { APIEmployee } from '../../../../../api/employees/types';

import styles from './styles.module.scss';

interface Props {
	detail: APIEmployee;
	onClick: (detail: any) => void;
}

const ExistingEmployeeDetails: FC<Props> = ({ detail, onClick }) => {
	const [t] = useTranslation('common');

	const language = useStore((state) => state.language);

	const selectButtonHandler = (e: any) => {
		onClick(e);
	};

	let hiringDate =
		detail?.hireDate !== null
			? format(new Date(detail?.hireDate!), 'dd MMMM yyyy', {
					locale: language !== 'ar' ? ar : enGB,
			  })
			: 'N/A';

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
					{/* <div>
						<div className={styles.heading}>
							{t('user.logName', { framework: 'React' })}
						</div>
						<div>
							{codeNo}
						</div>
					</div> */}
					<div>
						<div className={styles.heading}>
							{t('user.fullName', { framework: 'React' })}
						</div>
						<div>
							{language !== 'ar' ? detail.fullName : detail.nameEnglish}
						</div>
					</div>
					<div>
						<div className={styles.heading}>
							{t('user.hireDate', { framework: 'React' })}
						</div>
						<div>
							{/* {detail?.hireDate !== null
								? format(new Date(detail?.hireDate!), 'dd MMMM yyyy', {
										locale: language !== 'ar' ? ar : enGB,
								  })
								: 'N/A'} */}
							{hiringDate}
						</div>
					</div>
					{/* <div>
						<div className={styles.heading}>
							{t('user.gender', { framework: 'React' })}
						</div>
						<div>
							{language !== 'ar'
								? detail.gender?.name
								: detail.gender?.nameEnglish}
						</div>
					</div> */}
					<div>
						<div className={styles.heading}>
							{t('user.class', { framework: 'React' })}
						</div>
						<div>
							{language !== 'ar'
								? detail.class?.name!
								: detail.class?.nameEnglish!}
						</div>
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

export default ExistingEmployeeDetails;
