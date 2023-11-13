import { FC, useState } from "react";
import { NavDropdown, Navbar } from "react-bootstrap";

import "./styles.scss";
import styles from "./styles.module.scss";
import { APIMenuListItem } from "../../../api/menu/types";
import { useStore } from "../../../utils/store";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "../..";

interface Props {
	title: string;
	urlPath?: string;
	items?: APIMenuListItem[];
}

const NavMenuItem: FC<Props> = ({ title, urlPath, items }) => {
	const language = useStore((state) => state.language);
	const navigate = useNavigate();

	const [show, setShow] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [selectedPath, setSelectedPath] = useState<string>();

	const rootPath = "";

	const dropdownClickHandler = () => {
		if (items?.length! === 0) {
			navigate(urlPath!);
		}
	};

	const linkClickHandler = (path: string, isFile: boolean) => {
		if (isFile) {
			setSelectedPath(path);
			setShowModal(true);
		}
		// else {
		// 	navigate(path);
		// }
	};

	const closeModal = () => {
		setSelectedPath("");
		setShowModal(false);
	};

	const showDropdown = () => {
		setShow(!show);
	};
	const hideDropdown = () => {
		setShow(false);
	};

	return (
		<>
			<NavDropdown
				className={styles.navMenuItem}
				title={title}
				id="basic-nav-dropdown"
				show={items?.length! > 0 && show}
				onMouseEnter={showDropdown}
				onMouseLeave={hideDropdown}
				onClick={dropdownClickHandler}>
				{items?.map((subMenu, index) => (
					<NavDropdown.Item
						href={!subMenu.linkType?.isFile! ? subMenu.linkPath! ?? `` : ""}
						key={index}
						target={subMenu.isExternalPath ? "_blank" : ""}
						onClick={() =>
							linkClickHandler(
								subMenu.linkPath! ?? ``,
								subMenu.linkType?.isFile!
							)
						}>
						{language !== "ar" ? subMenu.name : subMenu.nameEnglish}
					</NavDropdown.Item>
				))}
			</NavDropdown>
			<Modal
				isOpen={showModal}
				onClose={closeModal}
				className={styles.modal}>
				<iframe
					title={title}
					src={selectedPath}
					width="100%"
					height="600"
					frameBorder="0"
				/>
			</Modal>
		</>
	);
};

export default NavMenuItem;
