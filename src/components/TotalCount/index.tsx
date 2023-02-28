import { FC } from "react";
import ShadowedContainer from "../ShadowedContainer";

interface Props {
	label?: string;
	count?: number;
}

const TotalCount: FC<Props> = ({ label = "Total Count", count = 0 }) => {
	return (
		<ShadowedContainer>
			{label}: {count}
		</ShadowedContainer>
	);
};

export default TotalCount;
