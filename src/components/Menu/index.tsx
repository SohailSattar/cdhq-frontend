import { FC, useState } from "react";
import { makeStyles } from "@material-ui/core";

import styles from "./styles.module.scss";

import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";

import Navbar from "react-bootstrap/Navbar";

import Button from "react-bootstrap/Button";

import NavDropdown from "react-bootstrap/NavDropdown";
import { NavMenuList, RedirectButton } from "..";
import * as RoutePath from "../../RouteConfig";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

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

interface APIMenuItem {
	title: string;
	link: string;
	items?: APIMenuItem[];
}

const rootPath = "";

const menuItems: APIMenuItem[] = [
	{
		title: "الإستراتيجية",
		link: "#",
		items: [
			{ title: "كلمة القائد", link: "/nh/LeaderQuotes.php" },
			{ title: "الرؤية و الرسالة", link: "/nh/view.php" },
			{
				title: "الخطة الاستراتيجية",
				link: "/appfiles/f6110/document/strplan2017.pdf",
			},
			{ title: "نظام الادارة المتكامل IMS", link: "/AppFiles/IMS/" },
		],
	},
	{
		title: "أنظمة الدفاع المدني",
		link: "#",
		items: [
			{ title: "أنظمة القيادة", link: "/cdhq/pmain/nh_index.php" },
			{ title: "الرؤية و الرسالة", link: "/nh/view.php" },
			{
				title: "نظام الحوادث",
				link: "/cdhq/p210/",
			},
			{ title: "الإستعداد والجاهزية RED-CON", link: "/cdhq/p5000/" },
			{ title: "الوقاية والسلامة", link: "http://172.17.186.50/" },
			{
				title: "الموارد البشرية",
				link: "http://srv110037.moi.ae/forms/frmservlet",
			},
			{
				title: "تراسل",
				link: "https://172.17.186.134/",
			},
			{ title: "تراسل moitarasol.moi.ae", link: "https://moitarasol.moi.ae/" },
			{
				title: "مؤشر زيارات EXPO 2020",
				link: "/nh/P6910/P6910_CHART.php",
			},
			{ title: "مؤشر لقاح  كوفيد 19", link: "/nh/covid/covid_chart_1.php" },
		],
	},
	{
		title: "أنظمة وزارة الداخلية",
		link: "#",
		items: [
			{
				title: "البوابة الداخلية",
				link: "https://portal.moi.ae/Pages/default.aspx",
			},
			{
				title: "الموارد البشرية",
				link: "http://srv110037.moi.ae/forms/frmservlet",
			},
			{
				title: "بوابة الـأنظمة الموحدة",
				link: "http://172.17.1.163/forms/frmservlet?config=moi",
			},
			{
				title: "البريد الداخلي",
				link: "https://exchange.moi.ae/owa/",
			},
			{
				title: "إدارة الشكاوى",
				link: "http://fh.moi.ae/",
			},
			{
				title: "نظام إدارة علاقة المتعاملين",
				link: "https://moiprdcrm.moi.ae/MOI-SmartCRMmain.aspx",
			},
			{
				title: "نظام لاشعارات الذكية",
				link: "http://172.17.186.105:8001/ords/f?p=131",
			},
			{
				title: "مؤشر قياس إنتاجية العاملين",
				link: "http://172.17.186.105:8001/ords/f?p=125",
			},
			{
				title: "إدارة المخاطر",
				link: "https://erm.moi.ae/PGP/",
			},
			{
				title: "تراسل",
				link: "https://172.17.186.134/",
			},
			{
				title: "تراسل moitarasol.moi.ae",
				link: "https://moitarasol.moi.ae/",
			},
		],
	},
	{
		title: "المكتبة الإلكترونية",
		link: "#",
		items: [
			{
				title: "إدارة الحماية المدنية والسلامة",
				link: "/AppFiles/protect/",
			},
			{
				title: "التوجه الاستراتيجي 2017 - 2021",
				link: "/AppFiles/STR_INDICATOR_S/",
			},
			{
				title: "بوابة الـأنظمة الموحدة",
				link: "/appfiles/egate/pdf/malia/procedures.htm",
			},
			{
				title: "البريد الداخلي",
				link: "https://exchange.moi.ae/owa/",
			},
			{
				title: "إدارة الشكاوى",
				link: "http://fh.moi.ae/",
			},
			{
				title: "نظام إدارة علاقة المتعاملين",
				link: "https://moiprdcrm.moi.ae/MOI-SmartCRMmain.aspx",
			},
			{
				title: "نظام لاشعارات الذكية",
				link: "http://172.17.186.105:8001/ords/f?p=131",
			},
			{
				title: "مؤشر قياس إنتاجية العاملين",
				link: "http://172.17.186.105:8001/ords/f?p=125",
			},
			{
				title: "إدارة المخاطر",
				link: "https://erm.moi.ae/PGP/",
			},
			{
				title: "تراسل",
				link: "https://172.17.186.134/",
			},
			{
				title: "تراسل moitarasol.moi.ae",
				link: "https://moitarasol.moi.ae/",
			},
		],
	},
];
export interface Props {
	title: string;
}

const Menu: FC<Props> = ({ title }) => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const loginClickHandler = () => {
		navigate(RoutePath.LOGIN);
	};

	return (
		<>
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
			<div
				dir="rtl"
				className={styles.Menu}>
				<Navbar expand="lg">
					<Container>
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
								<NavMenuList data={menuItems} />
							</Nav>
						</Navbar.Collapse>
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
