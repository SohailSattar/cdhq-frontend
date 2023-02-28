import { FC } from "react";
import { ProjectCard } from "../..";

import styles from "./styles.module.scss";

interface Props {
	name: string;
	icon: string;
	available: boolean;
}

const ProjectBox: FC<Props> = ({ name, icon, available }) => {
	return (
		<div className={styles.projectBox}>
			<ProjectCard name={name} icon={icon} />
		</div>
	);
};

export default ProjectBox;
