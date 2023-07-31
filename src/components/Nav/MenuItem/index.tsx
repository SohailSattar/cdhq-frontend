import { FC, useState } from "react";
import { NavDropdown } from "react-bootstrap";

import "./styles.scss";
import styles from "./styles.module.scss";

interface APIMenuItem {
	title: string;
	link: string;
	items?: APIMenuItem[];
}

interface Props {
	title: string;
	link: string;
	items?: APIMenuItem[];
}

const NavMenuItem: FC<Props> = ({ title, link, items }) => {
	const [show, setShow] = useState(false);

	const rootPath = "";

	const showDropdown = () => {
		setShow(!show);
	};
	const hideDropdown = () => {
		setShow(false);
	};

	return (
		<NavDropdown
			className={styles.navMenuItem}
			title={title}
			id="basic-nav-dropdown"
			show={show}
			onMouseEnter={showDropdown}
			onMouseLeave={hideDropdown}>
			{items?.map((subMenu, index) => (
				<NavDropdown.Item
					href={`${rootPath}${subMenu.link}`}
					key={index}>
					{subMenu.title}
				</NavDropdown.Item>
			))}
		</NavDropdown>
	);
};

export default NavMenuItem;
