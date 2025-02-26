import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PrivilegeDetail } from "../..";
import { GetNextWorkflowStatus } from "../../../utils";

import styles from "./styles.module.scss";

interface Props {
	id: number;
	readPrivilege: boolean;
	insertPrivilege: boolean;
	updatePrivilege: boolean;
	deletePrivilege: boolean;
	canGrant: boolean;
	department: string;
	departmentStructureType: number;
}

const ProjectSummary: FC<Props> = ({
	id,
	readPrivilege,
	insertPrivilege,
	updatePrivilege,
	deletePrivilege,
	canGrant,
	department,
	departmentStructureType,
}) => {
	const [t] = useTranslation("common");

	return (
		<>
			<div className={styles.summary}>
				<div className={styles.details}>
					<div>
						{canGrant === true
							? t("project.canGrant", { framework: "React" })
							: t("project.canNotGrant", { framework: "React" })}

						<div>
							{departmentStructureType === 9
								? t("department.withChild", { framework: "React" })
								: t("department.single", { framework: "React" })}
						</div>
					</div>
					<div>{department}</div>
				</div>
			</div>
			<div style={{ marginTop: "15px" }}>
				<PrivilegeDetail
					readPrivilege={readPrivilege}
					insertPrivilege={insertPrivilege}
					updatePrivilege={updatePrivilege}
					deletePrivilege={deletePrivilege}
				/>
			</div>
		</>
	);
};

export default ProjectSummary;
