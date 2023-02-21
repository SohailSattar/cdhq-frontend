import { FC } from 'react';
import { useStore } from '../../utils/store';
import ShadowedContainer from '../ShadowedContainer';

interface Props {
	label?: string;
	count?: number;
}

const TotalCount: FC<Props> = ({ label = 'Total Count', count = 0 }) => {
	// const language = useStore((state) => state.language);

	return (
		<ShadowedContainer>
			{label}: {count}
		</ShadowedContainer>
	);
};

export default TotalCount;
