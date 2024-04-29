import { FC, useEffect, useState } from "react";
import Tree, { Node } from "../../TreeView";

import { getProjectsHierarchy } from "../../../api/projects/get/getProjectsHierarchy";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../utils/store";

export interface Props {
	onNodeClick: (e: any) => void;
}

const ProjectTree: FC<Props> = ({ onNodeClick }) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);

	const [hierarchies, setHierarchies] = useState<Node>();

	const id = 0;
	const name = t("project.list", { framework: "React" });

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await await getProjectsHierarchy();

			if (data) {
				var children: Node[] = data?.map((d) => {
					return {
						id: d.id,
						name: language !== "ar" ? d.name : d.nameEnglish,
						children: d.projects?.map((p) => {
							return {
								id: p.id,
								name: language !== "ar" ? p.name : p.nameEnglish,
							};
						}),
					};
				});

				setHierarchies({ id: id, name: name, children: children });
			}
		};

		fetchData();
	}, [language, name]);

	return (
		<Tree
			direction={language !== "ar" ? "rtl" : "ltr"}
			node={hierarchies}
			onNodeClick={onNodeClick}
		/>
	);
};

export default ProjectTree;
