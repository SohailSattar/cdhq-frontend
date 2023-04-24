import clsx from "clsx";
import { FC } from "react";

import styles from "./styles.module.scss";

interface Props {
	className?: any;
	children: any;
}

const ShadowedContainer: FC<Props> = ({ className, children }) => {
	return <div className={clsx(styles.container, className)}>{children}</div>;
};

export default ShadowedContainer;
