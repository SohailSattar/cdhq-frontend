import { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

interface Props {
	expiringIn: number;
	url: string;
}

const PasswordExpiryMessage: FC<Props> = ({ expiringIn, url }) => {
	return (
		<div className={styles.messageBox}>
			Password is expiring in {expiringIn} days. Please change your password by
			clicking <Link to={url}>here</Link>
		</div>
	);
};

export default PasswordExpiryMessage;
