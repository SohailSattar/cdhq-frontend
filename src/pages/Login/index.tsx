import { useNavigate } from "react-router-dom";
import { ImageLogo } from "./containers";

import { loginUser } from "../../api/login/post/loginUser";
import localStorageService from "../../network/localStorageService";
import { useStore } from "../../utils/store";
import { Flip, toast } from "react-toastify";
import { getPasswordValidity } from "../../api/users/get/getPasswordValidity";
import { LoginForm, ILoginFormInputs } from "../../components";
import { Footer, Header } from "../../components";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import { useCallback, useEffect } from "react";
import { checkLoginStatus } from "../../api/login/get/checkLoginStatus";
import { loginUserPhp } from "../../api/login/post/loginUserPhp";

const LoginPage = () => {
	const navigate = useNavigate();

	const loggedInUser = useStore((state) => state.loggedInUser);

	const setLoggedInUser = useStore((state) => state.setLoggedInUser);
	const setUserRole = useStore((state) => state.setUserRole);

	const stableNavigate = useCallback(navigate, []);

	const checkStatus = useCallback(async () => {
		const { data } = await checkLoginStatus();

		if (data?.isLoggedIn === true) {
			stableNavigate(RoutePath.HOME);
		}
	}, [stableNavigate]);

	useEffect(() => {
		checkStatus();
	}, [checkStatus, loggedInUser.id, stableNavigate]);

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

			setLoggedInUser({
				id: data.id,
				userName: data.userName,
				name: data.name,
				nameEnglish: data.nameEnglish,
				role: data.role,
			});

			setUserRole(data?.role! !== "" ? data?.role! : "USER");

			await loginUserPhp(values);

			// const { data: validity } = await getPasswordValidity();

			// if (validity) {
			// 	if (validity?.expiringInDays! > 0 && validity?.expiringInDays! <= 10) {
			// 		setPasswordValidity(validity!);
			// 	}

			// 	if (validity?.expiringInDays! <= 0) {
			// 		setPasswordValidity(validity!);
			// 		navigate(RoutePath.CHANGE_PASSWORD);
			// 	}
			// }
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
