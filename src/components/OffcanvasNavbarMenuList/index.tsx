import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import headerLinks from "../../data/header-link";
import clsx from "clsx";
import { Button } from "@material-ui/core";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
	role: string;
}

const OffcanvasNavbarMenuList: FC<Props> = ({ role }) => {
	const [t] = useTranslation("common");

	return (
		<div className={styles.menuList}>
			{headerLinks
				.filter((x) => x.displayFor?.includes(role))
				.map(({ short, url }) => {
					return (
						<div key={short}>
							<Button
								{...{
									key: short,
									to: url,
									component: RouterLink,
									className: clsx(styles.menuItem),
								}}>
								{t(`header.menu.${short}`, { framework: "React" })}
							</Button>
						</div>
					);
				})}
		</div>
	);
};

export default OffcanvasNavbarMenuList;
