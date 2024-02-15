import { FC } from "react";
import { APIDepartmentDetail } from "../../../../../api/departments/types";
import { ShadowedContainer } from "../../../../../components";
import { useStore } from "../../../../../utils/store";

import styles from "./styles.module.scss";

interface Props {
	detail: APIDepartmentDetail;
}

const DepartmentDetail: FC<Props> = ({ detail }) => {
	const language = useStore((state) => state.language);

	const deptName = language !== "ar" ? detail?.name : detail?.nameEnglish;

	return (
		<>
			<ShadowedContainer>
				<div className={styles.detail}>
					<div className={styles.heading}>
						<h4>{deptName}</h4>
					</div>
					<div className={styles.container}>
						<div>
							<div>Department Name [Full]</div>
							<div>{detail?.fullName}</div>
						</div>
						<div>
							<div>Emirate</div>
							<div>{detail?.emirate?.name}</div>
						</div>
						<div>
							<div>Level</div>
							<div>{detail?.level?.name}</div>
						</div>
					</div>
				</div>
			</ShadowedContainer>
		</>
	);
};

export default DepartmentDetail;
