import { useNavigate } from "react-router-dom";
import { ImageLogo } from "./containers";

import logo from "../../assets/logos/moi-logo.svg";
import { loginUser } from "../../api/login/post/loginUser";
import localStorageService from "../../network/localStorageService";
import { useStore } from "../../utils/store";
import { Flip, toast } from "react-toastify";
import { getPasswordValidity } from "../../api/users/get/getPasswordValidity";
import { LoginForm, ILoginFormInputs } from "../../components";
import { Footer, Header } from "../../components";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import { useEffect } from "react";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";

const LoginPage = () => {
	const navigate = useNavigate();

	const loggedInUser = useStore((state) => state.loggedInUser);

	const setLoggedInUser = useStore((state) => state.setLoggedInUser);
	const setUserRole = useStore((state) => state.setUserRole);
	const setPasswordValidity = useStore((state) => state.setPasswordValidity);

	useEffect(() => {
		if (loggedInUser.id !== 0) {
			navigate(RoutePath.HOME);
		}
	}, [loggedInUser, loggedInUser.id, navigate]);

	const submitHandler = async (values: ILoginFormInputs) => {
		const { data, error } = await loginUser(values);

		if (error) {
			toast.error(error.ErrorMessage, {
				// autoClose: false,
				autoClose: 2500,
				transition: Flip,
			});
		}

		if (data) {
			localStorageService?.setJwtToken(data?.token);

			// setCookie('id', data.id, { path: '/', expires: cookieExpiry });
			// setCookie('name', data.name, { path: '/', expires: cookieExpiry });
			// setCookie('nameEnglish', data.role, { path: '/', expires: cookieExpiry });
			// setCookie('userName', data.userName, {
			// 	path: '/',
			// 	expires: cookieExpiry,
			// });
			// setCookie('role', data.role, { path: '/', expires: cookieExpiry });
			// setCookie('token', data.token, {
			// 	path: '/',
			// 	expires: cookieExpiry,
			// 	httpOnly: true,
			// });

			setLoggedInUser({
				id: data.id,
				userName: data.userName,
				name: data.name,
				nameEnglish: data.nameEnglish,
				role: data.role,
			});

			// localStorageService?.setUserInfo({
			// 	id: data.id,
			// 	userName: data.userName,
			// 	name: data.name,
			// 	nameEnglish: data.nameEnglish,
			// 	role: data.role,
			// });

			setUserRole(data?.role! !== "" ? data?.role! : "USER");

			const { data: validity } = await getPasswordValidity();

			if (validity) {
				if (validity?.expiringInDays! > 0 && validity?.expiringInDays! <= 10) {
					setPasswordValidity(validity!);
				}

				if (validity?.expiringInDays! <= 0) {
					setPasswordValidity(validity!);
					navigate(RoutePath.CHANGE_PASSWORD);
				}
			}
		}
	};

	return (
		<>
			{/* <Header hideLoginButton={true} /> */}
			<div className={styles.layout}>
				<div className="container">
					<main
						role="main"
						className="pb-3">
						<div className="container container-custom-width">
							{/* <ImageLogo imagePath={logo} /> */}
							<LoginForm onSubmit={submitHandler} />
						</div>
					</main>
				</div>
			</div>
			{/* <Footer /> */}
		</>
	);
};

export default LoginPage;
