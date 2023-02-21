import clsx from 'clsx';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

interface Props {
	message: any;
	type: 'primary' | 'error';
	url?: string;
	urlText?: string;
}

const MessageBox: FC<Props> = ({ message, type, url, urlText }) => {
	let stylingClass;

	if (type === 'error') {
		stylingClass = styles.errorSection;
	}

	return (
		<div className={clsx(styles.messageBox, stylingClass)}>
			<div>{message}</div>
			{url && (
				<div>
					<Link to={url}>{!urlText ? url : urlText}</Link>
				</div>
			)}
		</div>
	);
};

export default MessageBox;
