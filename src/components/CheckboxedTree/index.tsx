import { FC, useEffect, useRef, useState } from "react";
import CheckboxTree from "react-checkbox-tree";

import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { Button } from "..";

import { useTranslation } from "react-i18next";

import "./styles.scss";
import { useStore } from "../../utils/store";

export interface Node {
	value: string;
	label: string;
	children?: Node[];
}

export interface Props {
	direction?: string;
	nodes: Node[];
	onNodeCheck: (checkedNodes: string[]) => void;
	isExpanded?: boolean;
}

const CheckboxedTree: FC<Props> = ({
	nodes,
	direction = "rtl",
	onNodeCheck,
	isExpanded = false,
}) => {
	const [t] = useTranslation("common");

	const language = useStore((state) => state.language);
	const treeRef = useRef<HTMLDivElement | null>(null);

	const [checked, setChecked] = useState<string[]>([]); // '110000000'
	const [expanded, setExpanded] = useState<string[]>([]);

	const [noCascade, setNoCascade] = useState(false);

	useEffect(() => {
		if (treeRef.current) {
			treeRef.current.scrollLeft = 0;
		}
	}, [language]);

	// const iterateHierarchy = (items: Node[]) => {
	// 	// const recursiveIterate = (subItems: Node[]) => {
	// 	// 	for (const item of subItems) {
	// 	// 		if (item.children && item.children.length > 0) {
	// 	// 			setExpanded((prevState) => {
	// 	// 				return [...prevState, item.value.toString()];
	// 	// 			});
	// 	// 			recursiveIterate(item.children); // Recursively iterate through children
	// 	// 		}
	// 	// 	}
	// 	// };

	// 	// recursiveIterate(items);

	// 	const recursiveIterate = (
	// 		subItems: Node[],
	// 		parentValues: string[] = []
	// 	) => {
	// 		for (const item of subItems) {
	// 			if (item.children && item.children.length > 0) {
	// 				// Check if the item's value is not already in the expanded state
	// 				if (!parentValues.includes(item.value.toString())) {
	// 					setExpanded((prevState) => {
	// 						return [...prevState, item.value.toString()];
	// 					});
	// 					parentValues.push(item.value.toString()); // Add the parent value to the tracking array
	// 				}
	// 				recursiveIterate(item.children, parentValues); // Recursively iterate through children, passing parentValues
	// 			}
	// 		}
	// 	};

	// 	recursiveIterate(items);
	// };

	function iterateHierarchicalList(list: Node[], level: number = 1) {
		list.forEach((item) => {
			if (level === 1 || level === 2) {
				setExpanded((prevState) => [...prevState, item.value]);
			}

			// Recursively iterate over children
			if (item.children && item.children?.length! > 0) {
				iterateHierarchicalList(item.children!, level + 1);
			}

			setChecked((prevState) => [...prevState, item.value]);
		});
	}

	useEffect(() => {
		if (isExpanded) {
			const deptids: string[] = [];
			iterateHierarchicalList(nodes);
			// nodes?.forEach((x) => {
			// 	deptids.push(x.value);

			// 	x.children?.forEach((c) => deptids.push(c.value));
			// });

			// if (treeRef.current) {
			// 	treeRef.current.scrollLeft = 0;
			// }

			console.log(expanded);

			// setExpanded(deptids);
		}
	}, [isExpanded, nodes]);

	const checkHandler = (checked: string[], node: any) => {
		setChecked(checked);
		onNodeCheck(checked);
	};

	const cascadeButtonClickHandler = () => {
		setNoCascade(!noCascade);
	};

	const clearButtonHandler = () => {
		setChecked((prevState) => []);
	};

	return (
		<div
			className="checkTree"
			ref={treeRef}>
			<div className="btnSection">
				<Button onClick={cascadeButtonClickHandler}>
					{t("button.selectChild", { framework: "React" })}:{" "}
					{!noCascade
						? t("status.on", { framework: "React" })
						: t("status.off", { framework: "React" })}
				</Button>
				<Button
					isRound
					onClick={clearButtonHandler}>
					{t("button.clear", { framework: "React" })}
				</Button>
			</div>
			<CheckboxTree
				nodes={nodes}
				checked={checked}
				onCheck={checkHandler}
				expanded={expanded}
				onExpand={setExpanded}
				checkModel="all"
				direction={direction}
				nameAsArray={true}
				noCascade={noCascade}
				showNodeIcon={false}
			/>
		</div>
	);
};

export default CheckboxedTree;
