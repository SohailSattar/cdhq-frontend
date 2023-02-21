import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import MessageBox from '../MessageBox';
import TextBox from '../TextBox';

import styles from './styles.module.scss';

export interface Props {
	onClick: (password: string) => void;
}

const PasswordBox: FC<Props> = ({ onClick }) => {
	const [t] = useTranslation('common');

	const [message, setMessage] = useState('');

	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');

	const passwordTextChangeHandler = (e: any) => {
		const text = e.target.value;
		setPassword(text);

		if (text !== password2 && password2.length > 0) {
			setMessage(t('message.passwordNotMatched', { framework: 'React' }));
		} else {
			setMessage('');
		}
	};

	const password2TextChangeHandler = (e: any) => {
		const text = e.target.value;
		setPassword2(text);

		if (text !== password) {
			setMessage(t('message.passwordNotMatched', { framework: 'React' }));
		} else {
			setMessage('');
		}
	};

	const passwordUpdateHandler = () => {
		if (password === password2 && password.length > 0) {
			onClick(password);
		}
	};

	return (
		<div className={styles.passwordBox}>
			<div className={styles.field}>
				<TextBox
					type='password'
					label={t('form.password', { framework: 'React' })}
					value={password}
					onChange={passwordTextChangeHandler}
				/>
			</div>
			<div className={styles.field}>
				<TextBox
					type='password'
					label={t('form.retypePassword', { framework: 'React' })}
					value={password2}
					onChange={password2TextChangeHandler}
				/>
			</div>
			{message && (
				<div className={styles.field}>
					<MessageBox type='error' message={message} />
				</div>
			)}
			<div>
				<Button onClick={passwordUpdateHandler}>
					{t('button.update', { framework: 'React' })}
				</Button>
			</div>
		</div>
	);
};

export default PasswordBox;
