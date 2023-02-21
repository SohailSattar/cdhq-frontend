import { FC } from 'react';

import styles from './styles.module.scss';

interface Props {
	name: string;
	icon:string;
}

const ProjectCard: FC<Props> = ({ name, icon }) => {
	return (
		<div className={styles.card}>
			<div style={{ float: 'right' }}>
				<div className={styles.icon}>
					<div className={styles.i}></div>
				</div>
			</div>
			<div className={styles.container}>
			<img src={icon} alt='Avatar' className={styles.imgIcon} />
			<div>{name}</div>
			</div>
		</div>
	);
};

export default ProjectCard;
