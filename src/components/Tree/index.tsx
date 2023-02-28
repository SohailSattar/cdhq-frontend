import { FC, useState } from "react";
import CheckboxTree, { OnCheckNode } from "react-checkbox-tree";

// import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import "./styles.scss";
export interface Node {
	value: string;
	label: string;
	children?: Node[];
}

export interface Props {
	direction?: string;
	nodes: Node[];
	onNodeCheck: (checkedNode: string) => void;
}

const Tree: FC<Props> = ({ nodes, direction = "rtl", onNodeCheck }) => {
	const [checked, setChecked] = useState<string[]>([]); // '110000000'
	const [expanded, setExpanded] = useState<string[]>([]);

	const checkHandler = (checked: string[], node: any) => {
		setChecked((prevState) => checked);
	};

	const clickHandler = (node: OnCheckNode) => {
		onNodeCheck(node.value);
	};

	return (
		<div className="tree">
			<CheckboxTree
				nodes={nodes}
				checked={checked}
				expanded={expanded}
				onCheck={checkHandler}
				onExpand={setExpanded}
				onClick={clickHandler}
				checkModel="all"
				direction={direction}
				nameAsArray={true}
				showNodeIcon={false}
			/>
		</div>
	);
};

export default Tree;
