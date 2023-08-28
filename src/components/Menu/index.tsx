import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { makeStyles } from "@material-ui/core";

import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";

import Navbar from "react-bootstrap/Navbar";

import Button from "react-bootstrap/Button";

import NavDropdown from "react-bootstrap/NavDropdown";
import { ChangeLanguage, Logout, NavMenuList, RedirectButton } from "..";
import * as RoutePath from "../../RouteConfig";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { getMenuList } from "../../api/menu/get/getMenuList";
import { APIMenuListItem } from "../../api/menu/types";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useStore } from "../../utils/store";
import localStorageService from "../../network/localStorageService";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";

import HouseLogo from "../../assets/icons/white-home-icon.png";

import styles from "./styles.module.scss";

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

	const loggedUser = useStore((state) => state.loggedInUser);

	const [isLogged, setIsLogged] = useState<boolean>(false);

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

	const checkLogin = useCallback(async () => {
		const { data: status } = await checkLoginStatus();

		const token = localStorageService.getJwtToken();

		if (token && status?.isLoggedIn === true) {
			setIsLogged(true);
		} else {
			setIsLogged(false);
		}
	}, []);

	useEffect(() => {
		checkLogin();
	}, [checkLogin]);

	useEffect(() => {
		fetchMenuItems();
	}, [fetchMenuItems]);

	const loginClickHandler = () => {
		navigate(RoutePath.LOGIN);
	};

	const logoutClickHandler = () => {
		setIsLogged(false);
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
				{/* <img
					src="/portal/static/media/moi-logo.svg"
					alt="text"
				/> */}
			</div>
			<div className={styles.Menu}>
				<Navbar expand="lg">
					<Container fluid>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />

						<Navbar.Collapse id="basic-navbar-nav">
							<Nav>
								<Nav.Link
									as={Link}
									to={isLogged ? RoutePath.HOME : RoutePath.LOGIN}>
									<img
										alt="home"
										className={styles.NavDropdownHome}
										style={{ width: "30px" }}
										src={HouseLogo}
									/>
								</Nav.Link>
								<NavMenuList data={menuList} />
								<ChangeLanguage className={styles.btnLanguage} />
								<div className={styles.btnContainer}>
									{isLogged ? (
										<Logout
											label={t("account.logout", { framework: "React" })}
											onClick={logoutClickHandler}
											className={styles.btnLogout}
										/>
									) : (
										<Button
											variant="outline-dark"
											onClick={loginClickHandler}
											className={styles.loginButton}>
											{t("account.login", { framework: "React" })}
										</Button>
									)}
								</div>
							</Nav>
						</Navbar.Collapse>

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
