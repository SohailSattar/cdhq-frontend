import { FC } from 'react';
import styles from './styles.module.scss';

interface Props {
	title: string;
}

const Card: FC<Props> = ({ title }) => {
	return (
		<div className={styles.card}>
			<img src='img_avatar.png' alt='Avatar' style={{ width: '100%' }} />
			<div className={styles.container}>
				<h4>
					<b>{title}</b>
				</h4>
				<p>Architect & Engineer</p>
			</div>
		</div>
	);
};

export default Card;
