import { FC } from "react";
import { useTranslation } from "react-i18next";
import { APIUserDetail } from "../../../../../api/users/types";

import styles from "./styles.module.scss";
import { useStore } from "../../../../../utils/store";
import { APIActiveStatus } from "../../../../../api/activeStatus/types";
import { Status } from "../../../../../components";

interface Props {
	user: APIUserDetail;
	status: APIActiveStatus;
}

const Details: FC<Props> = ({ user, status }) => {
	const [t] = useTranslation("common");
	const language = useStore((state) => state.language);

	return (
		<>
			<div className={styles.details}>
				{" "}
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("user.id", { framework: "React" })}
					</div>
					<div className={styles.text}>{user?.id}</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("user.logName", { framework: "React" })}
					</div>
					<div className={styles.text}>{user?.logName}</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("user.employeeNumber", { framework: "React" })}
					</div>
					<div className={styles.text}>{user?.employeeNo}</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("rank.name", { framework: "React" })}
					</div>
					<div className={styles.text}>
						{/* {user?.rank! !== null && <p>Hello</p>} */}
						{user?.rank! !== null
							? language !== "ar"
								? user?.rank!.name!
								: user?.rank!.nameEnglish!
							: "---"}
					</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("user.name", { framework: "React" })}
					</div>
					<div className={styles.text}>{user?.name}</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("user.nameEnglish", { framework: "React" })}
					</div>
					<div className={styles.text}>
						{user?.nameEnglish ? user?.nameEnglish! : "-"}
					</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("user.phone", { framework: "React" })}
					</div>
					<div className={styles.text}>{user?.phone ? user?.phone! : "-"}</div>
				</div>
			</div>
			<div className={styles.details}>
				{" "}
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("department.name", { framework: "React" })}
					</div>
					<div className={styles.text}>
						{language !== "ar"
							? user?.department?.fullName
							: user?.department?.fullNameEnglish}
					</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("class.name", { framework: "React" })}
					</div>
					<div className={styles.text}>
						{user?.class! !== null
							? language !== "ar"
								? user?.class!.name
								: user?.class!.nameEnglish
							: "--"}
					</div>
				</div>
				<div className={styles.detail}>
					<div className={styles.heading}>
						{t("global.status", { framework: "React" })}
					</div>
					<div className={styles.text}>
						<Status status={status!} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Details;
