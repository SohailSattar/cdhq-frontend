import { FC, useEffect, useState } from 'react';
import { Tree } from '..';

// import { Node } from '../';

import { getDepartmentHierarchy } from '../../api/departments/get/getDepartmentHierarchy';
import { getDepartmentsHierarchy } from '../../api/departments/get/getDepartmentsHierarchy';
import { useStore } from '../../utils/store';
import CheckboxedTree, { Node } from '../CheckboxedTree';

import './styles.scss';

export interface Props {
	id?: number;
	showCheckbox?: boolean;
	// node: Node;
	onNodeCheck: (ids: string[] | string) => void;
}

const DepartmentTree: FC<Props> = ({
	id,
	showCheckbox = true,
	onNodeCheck,
}) => {
	const [hierarchies, setHierarchies] = useState<Node[]>([]);

	const language = useStore((state) => state.language);

	useEffect(() => {
		const fetchData = async () => {
			if (!id) {
				const { data } = await getDepartmentsHierarchy();
				if (data) {
					setHierarchies([data]);
				}
			} else {
				const { data } = await getDepartmentHierarchy(id);
				if (data) {
					setHierarchies([data]);
				}
			}
		};

		fetchData();
	}, [id]);

	return showCheckbox ? (
		<CheckboxedTree
			nodes={hierarchies!}
			direction={language !== 'ar' ? 'rtl' : 'ltr'}
			onNodeCheck={onNodeCheck}
		/>
	) : (
		<Tree
			nodes={hierarchies!}
			direction={language !== 'ar' ? 'rtl' : 'ltr'}
			onNodeCheck={onNodeCheck}
		/>
	);
};

export default DepartmentTree;
