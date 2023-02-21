import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

interface Props {
	status: boolean;
}

const StatusIcon: FC<Props> = ({ status }) => {
	return (
		<FontAwesomeIcon
			icon={status ? faCheck : faXmark}
			color={status ? 'green' : '#ff3333'}
		/>
	);
};

export default StatusIcon;
