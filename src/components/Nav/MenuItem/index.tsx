import { FC, useState } from "react";
import { NavDropdown } from "react-bootstrap";

import "./styles.scss";
import styles from "./styles.module.scss";
import { APIMenuListItem } from "../../../api/menu/types";
import { useStore } from "../../../utils/store";

interface Props {
	title: string;
	items?: APIMenuListItem[];
}

const NavMenuItem: FC<Props> = ({ title, items }) => {
	const language = useStore((state) => state.language);
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
					href={subMenu.linkPath! ?? `#`}
					key={index}>
					{language !== "ar" ? subMenu.name : subMenu.nameEnglish}
				</NavDropdown.Item>
			))}
		</NavDropdown>
	);
};

export default NavMenuItem;
