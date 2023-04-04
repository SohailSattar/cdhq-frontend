import { FC } from "react";
import ProjectBox from "../ProjectBox";

import { APIProjectItem } from "../../../api/projects/types";

import { useStore } from "../../../utils/store";

import styles from "./styles.module.scss";
import { Link } from "react-router-dom";

interface Props {
	data: APIProjectItem[];
}

const ProjectBoxList: FC<Props> = ({ data }) => {
	const language = useStore((state) => state.language);

	return (
		<div className={styles.boxList}>
			{data.map((d, index) =>
				d.isExternalPath ? (
					<a href={d.pathLink || "#"} key={index} target="_blank">
						<ProjectBox
							key={d.id}
							name={language !== "ar" ? d.name : d.nameEnglish}
							icon={d.iconName!}
							available={true}
						/>
					</a>
				) : (
					<Link to={d.pathLink || "#"} key={index}>
						<ProjectBox
							key={d.id}
							name={language !== "ar" ? d.name : d.nameEnglish}
							icon={d.iconName!}
							available={true}
						/>
					</Link>
				)
			)}
		</div>
	);
};

export default ProjectBoxList;
