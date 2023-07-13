import { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

interface Props {
	title: string;
	children: any;
	className?: string;
}
const DisplayCard: FC<Props> = ({ title, children, className = "" }) => {
	return (
		<div className={clsx(styles.card, className)}>
			<div className={styles.title}>
				<h4>{title}</h4>
			</div>
			<div className={styles.container}>{children}</div>
		</div>
	);
};

export default DisplayCard;
