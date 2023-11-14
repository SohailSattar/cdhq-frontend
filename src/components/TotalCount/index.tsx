import { FC } from "react";
import ShadowedContainer from "../ShadowedContainer";

import styles from "./styles.module.scss";
import clsx from "clsx";

interface Props {
	label?: string;
	count?: number;
	className?: string;
}

const TotalCount: FC<Props> = ({
	label = "Total Count",
	count = 0,
	className,
}) => {
	return (
		<ShadowedContainer className={clsx(styles.totalCount, className)}>
			{label}: {count}
		</ShadowedContainer>
	);
};

export default TotalCount;
