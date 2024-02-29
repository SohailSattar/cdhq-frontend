import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
	Button,
	DepartmentTree,
	ShadowedContainer,
} from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";

import styles from "./styles.module.scss";
import { Id, emptyFunction } from "../../../../utils";

interface Props {
	children: any;
	onTreeNavigate?: (id: Id) => void;
}

const Layout: FC<Props> = ({ onTreeNavigate = emptyFunction, children }) => {
	const [t] = useTranslation("common");

	const navigate = useNavigate();

	const departmentNodeClickHandler = (id: any) => {
		// navigate(`${RoutePath.DEPARTMENT}/${id}`);
		onTreeNavigate(id);
	};

	return (
		<div className={styles.layout}>
			<div className={styles.container}>
				<div>
					<DepartmentTree
						onNodeCheck={departmentNodeClickHandler}
						showCheckbox={false}
					/>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
};

export default Layout;
