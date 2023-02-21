import { DepartmentTree, ShadowedContainer } from '../../../components';

import styles from './styles.module.scss';

export const HierarchyPage = () => {
	return (
		<div className={styles.hierarchy}>
			<div className={styles.tree}>
				<DepartmentTree onNodeCheck={() => {}} />
			</div>
			<ShadowedContainer className={styles.section}>xxx</ShadowedContainer>
		</div>
	);
};

export default HierarchyPage;
