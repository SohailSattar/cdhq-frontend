import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

import styles from "./styles.module.scss";
import { FC } from "react";

interface Props {
	onUpClick: () => void;
	onDownClick: () => void;
}

const UpDownArrow: FC<Props> = ({ onUpClick, onDownClick }) => {
	return (
		<div className={styles.updownArrow}>
			<div>
				<FontAwesomeIcon
					icon={faArrowUp}
					className={styles.icon}
					onClick={onUpClick}
				/>{" "}
			</div>
			<div>
				<FontAwesomeIcon
					icon={faArrowDown}
					className={styles.icon}
					onClick={onDownClick}
				/>
			</div>
		</div>
	);
};

export default UpDownArrow;
