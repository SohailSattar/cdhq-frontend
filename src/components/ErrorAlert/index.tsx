import { FC, useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { Hr, Modal } from "..";

interface Props {
	message: string;
	errors: string[];
}

const ErrorAlert: FC<Props> = ({ message, errors }) => {
	const [show, setShow] = useState<boolean>(false);

	useEffect(() => {
		if (errors.length > 0) {
			setShow(true);
		}
	}, [errors]);

	const closeHandler = () => {
		setShow(false);
	};

	return (
		<Modal
			isOpen={show}
			onClose={closeHandler}
			className={styles.errorAlert}>
			<div className={styles.header}>
				<h3>{message}</h3>
			</div>
			<Hr />
			{errors.map((error, index) => (
				<div
					className={styles.message}
					key={index}>
					{error}
				</div>
			))}
		</Modal>
	);
};

export default ErrorAlert;
