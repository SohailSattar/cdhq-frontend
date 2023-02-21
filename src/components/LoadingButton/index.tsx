import { FC } from 'react';
import { Button, Loading } from '..';

import styles from './styles.module.scss';

interface Props {
	label: string;
	isLoading?: boolean;
	onClick: () => void;
}

const LoadingButton: FC<Props> = ({ label, isLoading = false, onClick }) => {
	return (
		<Button className={styles.btn} disabled={isLoading} onClick={onClick}>
			{isLoading ? <Loading /> : label}
		</Button>
	);
};

export default LoadingButton;
