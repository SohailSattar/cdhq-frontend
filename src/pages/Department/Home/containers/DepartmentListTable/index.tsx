import { FC } from 'react';
import { SearchBox, Table } from '../../../../../components';

import styles from './styles.module.scss';

interface Data {
	columns: any[];
	rows: any[];
}

interface Props {
	data: Data;
	onUserSearch: (keyword: string) => void;
}

const DepartmentListTable: FC<Props> = ({ data, onUserSearch }) => {
	const userSearchHandler = (keyword: string) => {
		onUserSearch(keyword);
	};

	return (
		<div className={styles.usersList}>
			<div style={{ marginTop: 0 }}>
				<SearchBox onClick={userSearchHandler} />
			</div>
			<Table
				columns={data.columns}
				data={data.rows}

				// onRowClick={rowClickHandler}
			/>
		</div>
	);
};

export default DepartmentListTable;
