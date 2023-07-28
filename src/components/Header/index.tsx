import { AppBar, Toolbar, makeStyles, Button } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import headerLinks from "../../data/header-link";
import { useTranslation } from "react-i18next";
import { useStore } from "../../utils/store";

import logoEn from "../../assets/logos/logo.png";
import logoAr from "../../assets/logos/logo-ar.png";

import {
	ChangeLanguage,
	HeaderLogo,
	LoggedUser,
	Logout,
	RedirectButton,
} from "..";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import clsx from "clsx";
import { FC } from "react";

const useStyles = makeStyles(() => ({
	header: {
		// backgroundColor: '#b68a35',
		backgroundColor: "#fff",
		zIndex: 998,
	},
	menuButton: {
		fontFamily: "DINNextLTArabic",
		marginLeft: "38px",
		fontSize: "16px",
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

interface Props {
	hideLoginButton?: boolean;
}

const Header: FC<Props> = ({ hideLoginButton = false }) => {
	const [t, i18n] = useTranslation("common");
	const navigate = useNavigate();

	const toggleLanguage = useStore((state) => state.language);

	const loggedUser = useStore((state) => state.loggedInUser);

	const { header, menuButton, toolbar } = useStyles();

	// const [toggleLanguage, setToggleLanguage] = useState('en');

	// const setToggleLanguage = useStore((state) => state.setLanguage);

	// const changeLanguageHandler = () => {
	// 	if (toggleLanguage === 'en') {
	// 		setToggleLanguage('ar');
	// 		i18n.changeLanguage('en');
	// 	} else {
	// 		setToggleLanguage('en');
	// 		i18n.changeLanguage('ar');
	// 	}
	// };

	const userNameClickHandler = () => {
		const detailPath = RoutePath.USER_DETAIL.replace(
			RoutePath.ID,
			loggedUser.id.toString()
		);
		navigate(detailPath);
	};

	const logoutClickHandler = () => {
		navigate(RoutePath.ROOT);
	};

	const getMenuButtons = () => {
		return headerLinks
			.filter((x) => x.displayFor?.includes(loggedUser.role))
			.map(({ short, url }) => {
				return (
					<Button
						{...{
							key: short,
							to: url,
							component: RouterLink,
							className: clsx(styles.menuItem, menuButton),
						}}>
						{t(`header.menu.${short}`, { framework: "React" })}
					</Button>
				);
			});
	};

	const displayDesktop = () => {
		return (
			<Toolbar className={clsx(styles.header, toolbar)}>
				<div className={styles.logo}>
					<HeaderLogo
						src={toggleLanguage === "en" ? logoAr : logoEn}
						isLoggedIn={loggedUser.id !== 0}
					/>
				</div>
				<div className={styles.menuSection}>{getMenuButtons()}</div>
				<div className={styles.menuSection}>
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

					<ChangeLanguage className={clsx(styles.menuItem, menuButton)} />
					{loggedUser.userName ? (
						<Logout
							label={t("account.logout", { framework: "React" })}
							onClick={logoutClickHandler}
							className={clsx(styles.menuItem, styles.actionBtn, menuButton)}
						/>
					) : (
						hideLoginButton !== true && (
							<RedirectButton
								label={t("account.login", { framework: "React" })}
								redirectTo={RoutePath.LOGIN}
								className={clsx(styles.menuItem, styles.actionBtn, menuButton)}
							/>
						)
					)}
				</div>
				<FontAwesomeIcon
					icon={faBars}
					color="black"
					onClick={() => alert("Hello")}
					className={styles.hamburger}
				/>
			</Toolbar>
		);
	};

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
				<AppBar className={header}>{displayDesktop()}</AppBar>
			</header>
		</>
	);
};

export default Header;
