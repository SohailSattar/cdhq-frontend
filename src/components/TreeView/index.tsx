import { FC, useCallback, useMemo } from "react";
import classnames from "classnames";
import Tree, {
	DefaultNodeProps,
	treeHandlers,
	useTreeState,
} from "react-hyper-tree";

import { Direction } from "../types";

import "./styles.scss";

export interface Node {
	id: number;
	name: any;
	children?: Node[];
}

export interface Props {
	direction?: Direction;
	node?: Node;
	onNodeClick: (e: any) => void;
}

const TreeView: FC<Props> = ({ node, onNodeClick, direction = "rtl" }) => {
	const nodeClickHandler = useMemo(
		() => (e: any) => {
			onNodeClick(e);
		},
		[onNodeClick]
	);

	const renderNode = useCallback(
		({ node, onToggle }: DefaultNodeProps) => (
			<div
				className={direction === "rtl" ? "tree-node" : "tree-node-ltr"}
				key={node.data.title}
			>
				<div
					onClick={onToggle}
					className={classnames({
						"tree-icon": true,
						"empty-icon": !node.hasChildren(),
						[node.options.opened ? "close-icon" : "open-icon"]:
							node.hasChildren(),
					})}
				/>

				<div
					className={classnames({
						"node-content-wrapper": true,
						"node-selected": node.isSelected(),
					})}
					onClick={() => {
						treeHandlers.trees.tree.handlers.setSelected(
							node,
							!node.isSelected()
						);
						nodeClickHandler(node);
					}}
				>
					<div className="titles">
						<div className="node-title">{node.data.name}</div>
						{node.data.title && (
							<div className="node-subtitle">{node.data.title}</div>
						)}
					</div>
					{!!node.options.childrenCount && (
						<div className="children-length">
							<div>{node.options.childrenCount}</div>
						</div>
					)}
				</div>
			</div>
		),
		[direction, nodeClickHandler]
	);

	const data = { ...node }; //
	//  {
	// 	id: 1,
	// 	name: 'Parent 1',
	// 	children: [
	// 		{
	// 			id: 2,
	// 			name: 'Child 1',
	// 			children: [
	// 				{
	// 					id: 5,
	// 					name: 'Child 1__1',
	// 				},
	// 				{
	// 					id: 6,
	// 					name: 'Child 1__2',
	// 				},
	// 				{
	// 					id: 7,
	// 					name: 'Child 1__3',
	// 				},
	// 			],
	// 		},
	// 	],
	// };

	const { required, handlers } = useTreeState({
		data,
		id: "tree",
	});

	return (
		<Tree
			{...required}
			{...handlers}
			horizontalLineStyles={{
				stroke: "#c4c4c4",
				strokeWidth: 1,
				strokeDasharray: "1 4",
			}}
			verticalLineStyles={{
				stroke: "#c4c4c4",
				strokeWidth: 1,
				strokeDasharray: "1 4",
			}}
			disableLines={true}
			renderNode={renderNode}
		/>
	);
};

export default TreeView;
