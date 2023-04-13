import { FC } from "react";
import { PasswordForm, IPasswordFormInputs } from "../../../../../components";

import styles from "./styles.module.scss";

interface Props {
	onClick: (data: IPasswordFormInputs) => void;
}

const ChangePassword: FC<Props> = ({ onClick }) => {
	return (
		<div className={styles.changePassword}>
			<PasswordForm onSubmit={onClick} />
		</div>
	);
};

export default ChangePassword;
