import { FC } from 'react';

import styles from './styles.module.scss';

export interface Props {
	color?: string;
	text?: string;
}

const Loading: FC<Props> = ({ color = '#000', text = '' }) => {
	return (
		<span className={styles.loading} style={{ color }}>
			{text}
		</span>
	);
};

export default Loading;
