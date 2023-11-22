import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Layout, MainLayout, ProtectedRoute } from "./components";

import {
	UserNewPage,
	HomePage,
	LoginPage,
	ProjectDetailPage,
	ProjectManagementHomePage,
	UserDetailPage,
	UsersHomePage,
	UserEditPage,
	PageNotFound,
	ProjectCreatePage,
	ProjectEditPage,
	AssignUserToProjectPage,
	EditUserProjectPage,
	UserSearchPage,
	ChangePasswordPage,
	AssignProjectToUserPage,
	EditProjectUserPage,
	PhoneDirectory,
	NewsCreatePage,
	NewsHomePage,
	NewsEditPage,
	NewsDetailPage,
	HonorsHomePage,
	HonorNewPage,
	HonorEditPage,
	LandingPage,
	MenuEditSettingsPage,
	SettingsHomePage,
	MenuHomeSettingsPage,
	MenuNewSettingsPage,
	LinkTypesNewSettingsPage,
	LinkTypesEditSettingsPage,
	ImageManagementHomePage,
	ImageManagementNewPage,
	ImageManagementEditPage,
} from "./pages";

import * as RoutePath from "./RouteConfig";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./assets/css/all.min.css";
import "./assets/css/site.ar.css";
import "./assets/fonts/index.css";
import { useStore } from "./utils/store";
import { Project } from "./data/projects";

import { Worker } from "@react-pdf-viewer/core";

import styles from "./styles.module.scss";
import { useEffect } from "react";

function App() {
	const language = useStore((state) => state.language);

	// // Your token storage key (e.g., 'authToken')
	// const tokenKey = "token";

	// useEffect(() => {
	// 	// Check if the token is stored in sessionStorage
	// 	const sessionToken = sessionStorage.getItem(tokenKey);

	// 	console.log(sessionToken);

	// 	if (sessionToken) {
	// 		// If the token exists in sessionStorage, copy it to localStorage
	// 		localStorage.setItem(tokenKey, sessionToken);

	// 		// Clear the token from sessionStorage
	// 		sessionStorage.removeItem(tokenKey);
	// 	}

	// 	// Function to clear the token from local storage
	// 	const clearToken = () => {
	// 		localStorage.removeItem(tokenKey);
	// 	};

	// 	// Add an event listener for beforeunload
	// 	window.addEventListener("beforeunload", clearToken);

	// 	// Clean up the event listener when the component unmounts
	// 	return () => {
	// 		window.removeEventListener("beforeunload", clearToken);
	// 	};
	// }, []); // Empty dependency array to ensure the effect runs once

	return (
		<div className={styles.app}>
			<Worker workerUrl="">
				{" "}
				{/* https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js */}
				{/* <WebSession /> */}
				<Router basename={RoutePath.BASE_NAME}>
					<Routes>
						<Route
							path={RoutePath.ROOT}
							element={
								<Layout
									noChecks={true}
									className={styles.unpadded}
									showQRCodes={true}
									showLinks={true}>
									<LandingPage />
								</Layout>
							}
						/>
						<Route
							path={RoutePath.LOGIN}
							element={
								<Layout
									hideLoginButton={true}
									noChecks={true}>
									<LoginPage />
								</Layout>
							}
						/>
						<Route element={<ProtectedRoute />}>
							<Route
								path={RoutePath.USER}
								element={
									<Layout>
										<UsersHomePage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={RoutePath.HOME}
								element={
									<Layout>
										<HomePage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.CHANGE_PASSWORD}`}
								element={
									<Layout>
										<ChangePasswordPage />
									</Layout>
								}
							/>
						</Route>
						{/* SETTING */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.SETTINGS}`}
								element={
									<Layout>
										<SettingsHomePage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.SETTINGS_MENU}`}
								element={
									<Layout>
										<MenuHomeSettingsPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.SETTINGS_MENU_EDIT}`}
								element={
									<Layout>
										<MenuEditSettingsPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.SETTINGS_MENU_NEW}`}
								element={
									<Layout>
										<MenuNewSettingsPage />
									</Layout>
								}
							/>
						</Route>
						{/* SETTINGS - LINK TYPES */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.SETTINGS_LINK_TYPES}`}
								element={
									<Layout>
										<MenuHomeSettingsPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.SETTINGS_LINK_TYPES_EDIT}`}
								element={
									<Layout>
										<LinkTypesEditSettingsPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.SETTINGS_LINK_TYPES_NEW}`}
								element={
									<Layout>
										<LinkTypesNewSettingsPage />
									</Layout>
								}
							/>
						</Route>
						{/* User */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.USER}/:id`}
								element={
									<Layout>
										<UserDetailPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={RoutePath.USER_NEW}
								element={
									<Layout>
										<UserNewPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.USER_NEW}/:id`}
								element={
									<Layout>
										<UserNewPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={RoutePath.USER_SEARCH}
								element={
									<Layout>
										<UserSearchPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.USER}/:id/edit`}
								element={
									<Layout>
										<UserEditPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.USER}/:id/project/assign`}
								element={
									<Layout>
										<AssignProjectToUserPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.USER}/:userId/project/:userProjectId/edit`}
								element={
									<Layout>
										<EditUserProjectPage />
									</Layout>
								}
							/>
						</Route>
						{/* PROJECT */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={RoutePath.PROJECT}
								element={
									<Layout>
										<ProjectManagementHomePage />
									</Layout>
								}
							/>
						</Route>

						<Route element={<ProtectedRoute />}>
							<Route
								path={RoutePath.PROJECT_NEW}
								element={
									<Layout>
										<ProjectCreatePage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.PROJECT}/:id`}
								element={
									<Layout>
										<ProjectDetailPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.PROJECT}/:id/edit`}
								element={
									<Layout>
										<ProjectEditPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.PROJECT}/:id/user/assign`}
								element={
									<Layout>
										<AssignUserToProjectPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.PROJECT}/:id/user/:userProjectId/edit`}
								element={
									<Layout>
										<EditProjectUserPage />
									</Layout>
								}
							/>
						</Route>
						{/* <Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.PROJECT}/hierarchy`}
							element={
								<Layout>
									<ProjectHierarchyPage />
								</Layout>
							}
						/>
					</Route> */}
						{/* Department */}
						{/* <Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.DEPARTMENT}`}
							element={
								<Layout>
									<DepartmentHomePage />
								</Layout>
							}
						/>
					</Route>

					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.DEPARTMENT}/:id`}
							element={
								<Layout>
									<DepartmentDetailPage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.DEPARTMENT}/:id/edit`}
							element={
								<Layout>
									<DepartmentEditPage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.DEPARTMENT}/hierarchy`}
							element={
								<Layout>
									<DepartmentHierarchyPage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.DEPARTMENT}/new`}
							element={
								<Layout>
									<NewDepartmentPage />
								</Layout>
							}
						/>
					</Route> */}
						{/* Honors */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.HONORS}`}
								element={
									<Layout
									// projectId={Project.Honors}  TODO: Fix this
									>
										<HonorsHomePage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.HONORS_NEW}`}
								element={
									<Layout

									// projectId={Project.Honors}  TODO: Fix this
									>
										<HonorNewPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.HONORS_EDIT}`}
								element={
									<Layout
									// projectId={Project.Honors}   TODO: Fix this
									>
										<HonorEditPage />
									</Layout>
								}
							/>
						</Route>
						{/* Image Management */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.IMAGE_MANAGING}`}
								element={
									<Layout
									// projectId={Project.ImageManagement}  TODO: Fix this
									// privilegeType={"Read"}
									>
										<ImageManagementHomePage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.IMAGE_MANAGING_NEW}`}
								element={
									<Layout>
										<ImageManagementNewPage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.IMAGE_MANAGING_EDIT}`}
								element={
									<Layout>
										<ImageManagementEditPage />
									</Layout>
								}
							/>
						</Route>
						{/* News */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.NEWS}`}
								element={
									<Layout>
										<NewsHomePage />
									</Layout>
								}
							/>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.NEWS_NEW}`}
								element={
									<Layout>
										<NewsCreatePage />
									</Layout>
								}
							/>
						</Route>
						<Route
							path={RoutePath.NEWS_DETAIL}
							element={
								<Layout>
									<NewsDetailPage />
								</Layout>
							}
						/>
						<Route element={<ProtectedRoute />}>
							<Route
								path={RoutePath.NEWS_EDIT}
								element={
									<Layout
										// projectId={Project.News}  TODO: Fix this
										privilegeType="Update">
										<NewsEditPage />
									</Layout>
								}
							/>
						</Route>
						{/* Phone Directory */}
						<Route element={<ProtectedRoute />}>
							<Route
								path={`${RoutePath.PHONE_DIRECTORY}`}
								element={
									<Layout
										// projectId={Project.PhoneDirectory} TODO: Fix this
										privilegeType="Read">
										<PhoneDirectory />
									</Layout>
								}
							/>
						</Route>
						{/*  Not Found Page */}
						<Route
							path="*"
							element={
								<Layout>
									<PageNotFound />
								</Layout>
							}
						/>
					</Routes>
				</Router>
			</Worker>
			<ToastContainer
				rtl={language !== "ar" ? true : false}
				position="top-center"
				autoClose={1500}
				hideProgressBar
				pauseOnFocusLoss={false}
				pauseOnHover={false}
			/>
		</div>
	);
}

export default App;
