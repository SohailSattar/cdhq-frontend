import clsx from "clsx";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import {
	ChangeLanguage,
	HeaderLogo,
	LoggedUser,
	Logout,
	OffcanvasNavbarMenuList,
} from "..";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { faBars, faGear } from "@fortawesome/free-solid-svg-icons";

import headerLinks from "../../data/header-link";

import logoEn from "../../assets/logos/logo.png";
import logoAr from "../../assets/logos/logo-ar.png";

import { useStore } from "../../utils/store";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button, makeStyles } from "@material-ui/core";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import "./styles.scss";
import { ROLE } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const OffcanvasNavbar = () => {
	const [t, i18n] = useTranslation("common");
	const navigate = useNavigate();
	const toggleLanguage = useStore((state) => state.language);
	const loggedUser = useStore((state) => state.loggedInUser);
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

	const getMenuButtons = () => {
		return headerLinks
			.filter((x) => x.displayFor?.includes(loggedUser.role))
			.map(({ short, url }) => {
				return (
					<div>
						<Button
							{...{
								key: short,
								to: url,
								component: RouterLink,
								className: clsx(styles.menuItem, menuButton),
							}}>
							{t(`header.menu.${short}`, { framework: "React" })}
						</Button>
					</div>
				);
			});
	};

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const handleClose = () => {
		setMenuOpen(false);
	};

	const userNameClickHandler = () => {
		const detailPath = RoutePath.USER_DETAIL.replace(
			RoutePath.ID,
			loggedUser.id.toString()
		);
		navigate(detailPath);
	};

	const gearClickHandler = () => {
		navigate(RoutePath.SETTINGS);
	};

	const logoutClickHandler = () => {
		navigate(RoutePath.LOGIN);
	};
	// const userName = "Sohail Abdul Sattar";
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
				<Navbar
					bg="light"
					expand={size}
					className={clsx("mb-3", styles.navbar)}>
					<Container fluid>
						<HeaderLogo
							isLoggedIn
							src={toggleLanguage === "en" ? logoAr : logoEn}
						/>
						{/* <ChangeLanguage /> */}
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
								<Offcanvas.Title id={`offcanvasNavbarLabel-expand-${size}`}>
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
								<OffcanvasNavbarMenuList role={loggedUser.role} />
								{/* {getMenuButtons()} */}
								<div className={styles.actionDiv}>
									<div className={styles.configDiv}>
										<ChangeLanguage
											className={clsx(styles.menuItem, menuButton)}
										/>
										{loggedUser.role === ROLE.SUPERADMIN && (
											<div className={styles.setting}>
												<FontAwesomeIcon
													icon={faGear}
													style={{ color: "black", cursor: "pointer" }}
													onClick={gearClickHandler}
													className={clsx(
														styles.menuItem,
														styles.actionBtn,
														menuButton
													)}
												/>
											</div>
										)}
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
					</Container>
				</Navbar>
			</header>
		</>
	);
};

export default OffcanvasNavbar;
