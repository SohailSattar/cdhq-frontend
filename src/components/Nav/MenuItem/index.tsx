import { FC, useState } from "react";
import { NavDropdown, Navbar } from "react-bootstrap";

import "./styles.scss";
import styles from "./styles.module.scss";
import { APIMenuListItem } from "../../../api/menu/types";
import { useStore } from "../../../utils/store";
import { Link, useNavigate } from "react-router-dom";
import { Modal, VideoModal } from "../..";
import { APILinkTypeDetail } from "../../../api/linkTypes/types";

import * as Routepath from "../../../RouteConfig";

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
	const [isVideo, setIsVideo] = useState<boolean>(false);

	const [selectedPath, setSelectedPath] = useState<string>("");

	const rootPath = "";

	const dropdownClickHandler = () => {
		if (items?.length! === 0) {
			navigate(urlPath!);
		}
	};

	const linkClickHandler = (path: string, linkType: APILinkTypeDetail) => {
		if (linkType?.isFile! && linkType.id === 1) {
			setIsVideo(true);
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

	const processLink = (menuItem: APIMenuListItem) => {
		if (menuItem.linkPath!) {
			if (menuItem.linkPath! && menuItem.linkType?.id !== 1) {
				return menuItem.linkPath;
			}
		}

		return "";
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
					<Link
						to={processLink(subMenu)}
						className={"nav-link"}
						target={
							subMenu.isExternalPath || subMenu.linkType?.id === 2
								? "_blank"
								: ""
						}
						onClick={() =>
							linkClickHandler(subMenu.linkPath! ?? "", subMenu.linkType!)
						}>
						{language !== "ar" ? subMenu.name : subMenu.nameEnglish}
					</Link>

					// <NavDropdown.Item
					// 	href={processLink(subMenu)}
					// 	key={index}
					// 	target={
					// 		subMenu.isExternalPath || subMenu.linkType?.id === 2
					// 			? "_blank"
					// 			: ""
					// 	}
					// 	onClick={() =>
					// 		linkClickHandler(subMenu.linkPath! ?? ``, subMenu.linkType!)
					// 	}>
					// 	{language !== "ar" ? subMenu.name : subMenu.nameEnglish}
					// </NavDropdown.Item>
				))}
			</NavDropdown>
			{showModal &&
				(isVideo ? (
					<VideoModal
						isOpen={showModal}
						onClose={closeModal}
						selectedPath={selectedPath!}
					/>
				) : (
					<Modal
						isOpen={showModal}
						onClose={closeModal}
						className={styles.modal}>
						<iframe
							title={title}
							src={selectedPath}
							width="100%"
							height="600px"
							frameBorder="0"
						/>
					</Modal>
				))}
		</>
	);
};

export default NavMenuItem;
