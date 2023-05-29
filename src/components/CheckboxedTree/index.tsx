import { FC, useState } from "react";
import CheckboxTree from "react-checkbox-tree";

import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { Button } from "..";

import { useTranslation } from "react-i18next";

import "./styles.scss";

export interface Node {
	value: string;
	label: string;
	children?: Node[];
}

export interface Props {
	direction?: string;
	nodes: Node[];
	onNodeCheck: (checkedNodes: string[]) => void;
}

const CheckboxedTree: FC<Props> = ({
	nodes,
	direction = "rtl",
	onNodeCheck,
}) => {
	const [t] = useTranslation("common");
	const [checked, setChecked] = useState<string[]>([]); // '110000000'
	const [expanded, setExpanded] = useState<string[]>([]);

	const [noCascade, setNoCascade] = useState(false);

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
		<div className="checkTree">
			<div className="btnSection">
				<Button onClick={cascadeButtonClickHandler}>
					Select Child: {!noCascade ? "On" : "Off"}
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
				expanded={expanded}
				onCheck={checkHandler}
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
