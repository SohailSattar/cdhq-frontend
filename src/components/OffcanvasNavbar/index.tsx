import clsx from "clsx";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import {
	ChangeLanguage,
	LoggedUser,
	LogoHeader,
	Logout,
	NavMenuList,
	OffcanvasNavbarMenuList,
	RedirectButton,
} from "..";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { faBars, faGear } from "@fortawesome/free-solid-svg-icons";

import headerLinks from "../../data/header-link";

import { useStore } from "../../utils/store";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

import * as RoutePath from "../../RouteConfig";

import HouseLogo from "../../assets/icons/white-home-icon.png";
import EmblemLogo from "../../assets/icons/white-emblem-icon.png";

import { ROLE } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { APIMenuListItem } from "../../api/menu/types";
import { getMenuList } from "../../api/menu/get/getMenuList";

import styles from "./styles.module.scss";
import "./styles.scss";
import { makeStyles } from "@material-ui/core";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";

const useStyles = makeStyles(() => ({
	header: {
		backgroundColor: "#b68a35",
		// backgroundColor: "#fff",
		zIndex: 998,
	},
	menuButton: {
		fontFamily: "DINNextLTArabic",
		// marginLeft: "38px",
		fontSize: "16px",
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

interface Props {
	showHeaderLogo?: boolean;
	hideLoginButton?: boolean;
}

const OffcanvasNavbar: FC<Props> = ({ showHeaderLogo, hideLoginButton }) => {
	const [t, i18n] = useTranslation("common");
	const navigate = useNavigate();
	const toggleLanguage = useStore((state) => state.language);
	const loggedUser = useStore((state) => state.loggedInUser);

	const [isLogged, setIsLogged] = useState<boolean>(false);

	const [menuList, setMenuList] = useState<APIMenuListItem[]>([]);
	const [menuOpen, setMenuOpen] = useState(false);

	const { header, menuButton, toolbar } = useStyles();

	const [placement, setPlacement] = useState<"start" | "end">("start");

	useEffect(() => {
		if (toggleLanguage !== "ar") {
			setPlacement("end");
		} else {
			setPlacement("start");
		}
	}, [toggleLanguage]);

	const checkIfIsLogged = useMemo(
		() => async () => {
			const { data } = await checkLoginStatus();
			if (data) {
				setIsLogged(data.isLoggedIn!);
			}
		},
		[]
	);

	useEffect(() => {
		checkIfIsLogged();
	}, []);

	const fetchMenuItems = useMemo(
		() => async () => {
			const { data } = await getMenuList();
			if (data) {
				setMenuList(data!);
			}
		},
		[setMenuList]
	);

	useEffect(() => {
		fetchMenuItems();
	}, []);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const handleClose = () => {
		setMenuOpen(false);
	};

	const userNameClickHandler = () => {
		const detailPath = RoutePath.USER_EDIT.replace(
			RoutePath.ID,
			loggedUser.id.toString()
		);
		navigate(detailPath);
		handleClose();
	};

	// const gearClickHandler = () => {
	// 	handleClose();
	// 	navigate(RoutePath.SETTINGS);
	// };

	const loginClickHandler = () => {
		navigate(RoutePath.LOGIN);
	};

	const logoutClickHandler = () => {
		handleClose();
		navigate(RoutePath.LOGIN);
	};

	const size = false;
	return (
		<>
			<header>
				<HelmetProvider>
					<Helmet>
						<style>{`:root {direction: ${
							i18n.language === "ar" ? "rtl" : "ltr"
						};}`}</style>
					</Helmet>
				</HelmetProvider>
				{showHeaderLogo && <LogoHeader />}
				<Navbar
					expand={size}
					className={clsx("mb-3", "navbar", styles.navbar)}
					id="basic-navbar-nav">
					<Container fluid>
						<div className={styles.navCat}>
							<Nav.Link
								as={RouterLink}
								to={RoutePath.ROOT}>
								<img
									alt="home"
									className={styles.NavDropdownHome}
									style={{ width: "30px" }}
									src={showHeaderLogo ? HouseLogo : EmblemLogo}
								/>
							</Nav.Link>
						</div>
						<div className={styles.navCat}>
							<NavMenuList data={menuList} />
						</div>
						<div>
							<ChangeLanguage />

							{loggedUser.userName ? (
								<>
									<Navbar.Toggle
										aria-controls={`offcanvasNavbar-expand-${size}`}
										onClick={toggleMenu}
									/>
									<Navbar.Offcanvas
										id={`offcanvasNavbar-expand-${size}`}
										aria-labelledby={`offcanvasNavbarLabel-expand-${size}`}
										placement={placement}
										className={styles.offcanvas}
										show={menuOpen}
										onHide={handleClose}>
										<Offcanvas.Header
											closeButton
											closeVariant="white">
											<Offcanvas.Title
												id={`offcanvasNavbarLabel-expand-${size}`}>
												{loggedUser.userName && (
													<LoggedUser
														fullName={
															toggleLanguage !== "ar"
																? loggedUser.name!
																: loggedUser.nameEnglish
														}
														userName={loggedUser.userName}
														className={clsx(styles.menuItem, menuButton)}
														onClick={userNameClickHandler}
													/>
												)}
											</Offcanvas.Title>
										</Offcanvas.Header>
										<Offcanvas.Body>
											{/* <Nav
									className="justify-content-end flex-grow-1 pe-3"
									onClick={toggleMenu}
								/> */}
											<OffcanvasNavbarMenuList
												role={loggedUser.role}
												onClick={handleClose}
											/>
											{/* {getMenuButtons()} */}
											<div className={styles.actionDiv}>
												<div className={styles.configDiv}>
													<ChangeLanguage
														className={clsx(
															styles.menuItem,
															menuButton,
															styles.languageChange
														)}
													/>
												</div>
												<Logout
													label={t("account.logout", { framework: "React" })}
													onClick={logoutClickHandler}
													className={clsx(
														styles.menuItem,
														styles.actionBtn,
														menuButton
													)}
												/>
											</div>
										</Offcanvas.Body>
									</Navbar.Offcanvas>
								</>
							) : (
								hideLoginButton !== true && (
									// <RedirectButton
									// 	label={t("account.login", { framework: "React" })}
									// 	redirectTo={RoutePath.LOGIN}
									// 	// className={clsx(styles.menuItem, styles.actionBtn, menuButton)}
									// />
									<Button
										variant="outline-dark"
										onClick={loginClickHandler}
										className={styles.loginButton}>
										{t("account.login", { framework: "React" })}
									</Button>
								)
							)}
						</div>
					</Container>
				</Navbar>
			</header>
		</>
	);
};

export default OffcanvasNavbar;
