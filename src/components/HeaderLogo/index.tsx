import { FC } from "react";
import { Link } from "react-router-dom";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";

export interface Props {
	src: string;
}

const HeaderLogo: FC<Props> = ({ src }) => {
	return (
		<Link to={RoutePath.ROOT}>
			{" "}
			<img src={src} alt="" className={styles.logo} />
		</Link>
	);
};

export default HeaderLogo;
