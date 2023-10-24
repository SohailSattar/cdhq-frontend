import { FC, useEffect, useState } from "react";
import { Tree } from "..";

// import { Node } from '../';

import { getDepartmentHierarchy } from "../../api/departments/get/getDepartmentHierarchy";
import { getDepartmentsHierarchy } from "../../api/departments/get/getDepartmentsHierarchy";
import { useStore } from "../../utils/store";
import CheckboxedTree, { Node } from "../CheckboxedTree";

import "./styles.scss";
import { getDepartmentHierarchyByProject } from "../../api/departments/get/getDepartmentHierarchyByProject";
import { APIDepartmentHierarchy } from "../../api/departments/types";

export interface Props {
	id?: number;
	showCheckbox?: boolean;
	// node: Node;
	onNodeCheck: (ids: string[] | string) => void;
	forProject?: boolean;
	isExpanded?: boolean;
}

const DepartmentTree: FC<Props> = ({
	id,
	showCheckbox = true,
	onNodeCheck,
	forProject = true,
	isExpanded = false,
}) => {
	const [hierarchies, setHierarchies] = useState<Node[]>([]);

	const language = useStore((state) => state.language);

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				const { data } = await getDepartmentsHierarchy();
				if (data) {
					[data].forEach((obj) => {
						renameNestedObjects(obj);
					});
					setHierarchies([data]);
				}
			} else {
				if (forProject) {
					const { data } = await getDepartmentHierarchyByProject(id);
					if (data) {
						[data].forEach((obj) => {
							renameNestedObjects(obj);
						});
						setHierarchies([data]);
					}
				} else {
					const { data } = await getDepartmentHierarchy(id);
					if (data) {
						[data].forEach((obj) => {
							renameNestedObjects(obj);
						});
						setHierarchies([data]);
					}
				}
			}
		};
		fetchData();
	}, [id, language]);

	const renameNestedObjects = (obj: any) => {
		if (obj!.length > 0) {
			obj.forEach((item: any) => {
				renameObjects(item);
			});
		} else {
			renameObjects(obj);
		}
	};

	const renameObjects = (obj: any) => {
		Object.keys(obj).forEach((key, index) => {
			if (key === "id") {
				obj["value"] = obj["id"];
				delete obj["id"];
			}
			if (language !== "ar") {
				if (key === "name") {
					obj["label"] = obj["name"];
					delete obj["name"];
					delete obj["nameEnglish"];
				}
			} else {
				if (key === "nameEnglish") {
					obj["label"] = obj["nameEnglish"] || obj["label"];
					delete obj["nameEnglish"];
					delete obj["name"];
				}
			}
			if (key === "children") {
				renameNestedObjects(obj["children"]);
			}
		});
	};

	return showCheckbox ? (
		<CheckboxedTree
			nodes={hierarchies!}
			direction={language !== "ar" ? "rtl" : "ltr"}
			onNodeCheck={onNodeCheck}
			isExpanded
		/>
	) : (
		<Tree
			nodes={hierarchies!}
			direction={language !== "ar" ? "rtl" : "ltr"}
			onNodeCheck={onNodeCheck}
			isExpanded
		/>
	);
};

export default DepartmentTree;
