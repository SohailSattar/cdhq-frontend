import { FC } from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCircle } from "@fortawesome/free-solid-svg-icons";

export interface Props {
	name: string;
	icon: string;
	isLocked?: boolean;
}

const ProjectCard: FC<Props> = ({ name, icon, isLocked = true }) => {
	return (
		<div className={clsx(styles.card, isLocked && styles.locked)}>
			<div style={{ float: "right" }}>
				<div className={styles.icon}>
					{!isLocked ? (
						<FontAwesomeIcon
							icon={faCircle}
							color="#61ef61"
							className={styles.blink}
						/>
					) : (
						<FontAwesomeIcon color="#fd1f32" icon={faLock} />
					)}
				</div>
			</div>
			<div className={styles.container}>
				<img src={icon} alt="Avatar" className={styles.imgIcon} />
				<div>{name}</div>
			</div>
		</div>
	);
};

export default ProjectCard;
