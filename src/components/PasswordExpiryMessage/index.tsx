import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import RedirectButton from "../RedirectButton";

interface Props {
	expiringIn: number;
	url: string;
}

const PasswordExpiryMessage: FC<Props> = ({ expiringIn, url }) => {
	const [t] = useTranslation("common");

	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		const txt = t("message.passwordExpiring", { framework: "React" }).replace(
			"_EXPIRINGIN_",
			expiringIn.toString()
		);
		setMessage(txt);
	}, [expiringIn, message, t, url]);

	return (
		<div className={styles.messageBox}>
			<div className={styles.message}>{message}</div>
			<div>
				<RedirectButton
					label={t("button.changePassword", { framework: "React" })}
					redirectTo={url}
				/>
			</div>
		</div>
	);
};

export default PasswordExpiryMessage;
