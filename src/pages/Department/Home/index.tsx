import Layout from "../container/Layout";
import styles from "./styles.module.scss";

const DepartmentHomePage = () => {
	return (
		<Layout>
			<div>
				sss
				<div className={styles.content}>
					<div className={styles.table}>
						{/* <DepartmentListTable
					data={data}
					onUserSearch={departmentSearchClickHandler}
				/> */}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default DepartmentHomePage;
