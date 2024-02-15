import { FC, useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { Modal } from "..";

interface Props {
	errors: string[];
}

const ErrorAlert: FC<Props> = ({ errors }) => {
	const [show, setShow] = useState<boolean>(false);

	useEffect(() => {
		if (errors.length > 0) {
			setShow(true);
		}
	}, [errors]);

	const closeHandler = () => {
		setShow(false);
	};

	console.log(errors);

	return (
		<Modal
			isOpen={show}
			onClose={closeHandler}
			className={styles.errorAlert}>
			<div className={styles.header}>
				<h3>ERROR</h3>
			</div>
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
