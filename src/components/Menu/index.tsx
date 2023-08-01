import { FC, useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core";

import styles from "./styles.module.scss";

import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";

import Navbar from "react-bootstrap/Navbar";

import Button from "react-bootstrap/Button";

import NavDropdown from "react-bootstrap/NavDropdown";
import { ChangeLanguage, NavMenuList, RedirectButton } from "..";
import * as RoutePath from "../../RouteConfig";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { getMenuList } from "../../api/menu/get/getMenuList";
import { APIMenuListItem } from "../../api/menu/types";
import { Helmet, HelmetProvider } from "react-helmet-async";

const useStyles = makeStyles(() => ({
	header: {
		// backgroundColor: '#b68a35',
		backgroundColor: "#fff",
		zIndex: 998,
	},
	menuButton: {
		fontFamily: "DINNextLTArabic",
		marginLeft: "38px",
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

interface MenuListItem {
	title: string;
	link: string;
	items?: MenuListItem[];
}

export interface Props {
	title: string;
}

const Menu: FC<Props> = ({ title }) => {
	const [t, i18n] = useTranslation("common");
	const navigate = useNavigate();

	const [menuList, setMenuList] = useState<APIMenuListItem[]>([]);

	const fetchMenuItems = useMemo(
		() => async () => {
			const { data } = await getMenuList();
			if (data) {
				setMenuList(data!);
			}
		},
		[]
	);

	useEffect(() => {
		fetchMenuItems();
	}, [fetchMenuItems]);

	const loginClickHandler = () => {
		navigate(RoutePath.LOGIN);
	};

	return (
		<>
			<HelmetProvider>
				<Helmet>
					<style>{`:root {direction: ${
						i18n.language === "ar" ? "rtl" : "ltr"
					};}`}</style>
				</Helmet>
			</HelmetProvider>
			<div
				// style={{
				// 	backgroundImage:
				// 		"url('https://img.freepik.com/free-vector/stylish-line-pattern-background_361591-1174.jpg?w=1060&t=st=1678781765~exp=1678782365~hmac=19b909311ac8659a13999ac8a681f622df04f5915a8162d285207b3e70622742')",
				// }}
				className={styles.nav}>
				<img
					src="/portal/static/media/moi-logo.9513a445fa7fe6cd5192bab48cd22250.svg"
					alt="text"
				/>
			</div>
			<div className={styles.Menu}>
				<Navbar expand="lg">
					<Container fluid>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />

						<Navbar.Collapse id="basic-navbar-nav">
							<Nav>
								<Nav.Link href="">
									<img
										alt="home"
										className={styles.NavDropdownHome}
										style={{ width: "30px" }}
										src="https://icon-library.com/images/white-home-icon-png/white-home-icon-png-21.jpg"
									/>
								</Nav.Link>
								<NavMenuList data={menuList} />
							</Nav>
						</Navbar.Collapse>
						<ChangeLanguage />
						<Button
							variant="outline-dark"
							onClick={loginClickHandler}
							className={styles.loginButton}>
							{t("account.login", { framework: "React" })}
						</Button>
						{/* <RedirectButton
							label={t("account.login", { framework: "React" })}
							redirectTo={RoutePath.LOGIN}
							className={clsx(styles.menuItem, styles.actionBtn, menuButton)}
						/> */}
					</Container>
				</Navbar>
			</div>
		</>
	);
};

export default Menu;
