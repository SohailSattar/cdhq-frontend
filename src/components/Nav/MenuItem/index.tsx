import { FC, useState } from "react";
import { NavDropdown, Navbar } from "react-bootstrap";

import "./styles.scss";
import styles from "./styles.module.scss";
import { APIMenuListItem } from "../../../api/menu/types";
import { useStore } from "../../../utils/store";
import { Link, useNavigate } from "react-router-dom";

interface Props {
	title: string;
	urlPath?: string;
	items?: APIMenuListItem[];
}

const NavMenuItem: FC<Props> = ({ title, urlPath, items }) => {
	const language = useStore((state) => state.language);
	const navigate = useNavigate();

	const [show, setShow] = useState(false);

	const rootPath = "";

	const dropdownClickHandler = () => {
		if (items?.length! === 0) {
			navigate(urlPath!);
		}
	};

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
			show={items?.length! > 0 && show}
			onMouseEnter={showDropdown}
			onMouseLeave={hideDropdown}
			onClick={dropdownClickHandler}
			// as={Link}
			// to="/link2"
		>
			{items?.map((subMenu, index) => (
				<NavDropdown.Item
					href={subMenu.linkPath! ?? `#`}
					key={index}
					target="_blank">
					{language !== "ar" ? subMenu.name : subMenu.nameEnglish}
				</NavDropdown.Item>
			))}
		</NavDropdown>
	);
};

export default NavMenuItem;
