import { FC } from "react";
import { makeStyles } from "@material-ui/core";

import styles from "./styles.module.scss";

import Container from "react-bootstrap/Container";

import Nav from "react-bootstrap/Nav";

import Navbar from "react-bootstrap/Navbar";

import Button from "react-bootstrap/Button";

import NavDropdown from "react-bootstrap/NavDropdown";
import { RedirectButton } from "..";
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
export interface Props {
	title: string;
}

const Menu: FC<Props> = ({ title }) => {
	const [t, i18n] = useTranslation("common");
	const navigate = useNavigate();

	const loginClickHandler = () => {
		navigate(RoutePath.LOGIN);
	};

	return (
		<>
			<div
				style={{
					backgroundImage:
						"url('https://img.freepik.com/free-vector/stylish-line-pattern-background_361591-1174.jpg?w=1060&t=st=1678781765~exp=1678782365~hmac=19b909311ac8659a13999ac8a681f622df04f5915a8162d285207b3e70622742')",
				}}
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
								<a href="#">
									<img
										className={styles.NavDropdownHome}
										style={{ width: "30px" }}
										src="https://icon-library.com/images/white-home-icon-png/white-home-icon-png-21.jpg"
									/>
								</a>
								<NavDropdown
									className={styles.NavDropdown}
									title="الإستراتيجية"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown
									className={styles.NavDropdown}
									title="أنظمة الدفاع المدني"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown
									className={styles.NavDropdown}
									title="أنظمة وزارة الداخلية"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown
									className={styles.NavDropdown}
									title="المكتبة الإلكترونية"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown
									className={styles.NavDropdown}
									title="مكتبة الفيديو"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown
									className={styles.NavDropdown}
									title="مبادرات السعادة"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown
									className={styles.NavDropdown}
									title="الأكاديمية"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>

								<NavDropdown
									className={styles.NavDropdown}
									title="نماذج الطلبات"
									id="basic-nav-dropdown">
									<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.2">
										Another action
									</NavDropdown.Item>
									<NavDropdown.Item href="#action/3.3">
										Something
									</NavDropdown.Item>
									<NavDropdown.Divider />
									<NavDropdown.Item href="#action/3.4">
										Separated link
									</NavDropdown.Item>
								</NavDropdown>
							</Nav>
						</Navbar.Collapse>
						<Button
							variant="outline-dark"
							onClick={loginClickHandler}>
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
