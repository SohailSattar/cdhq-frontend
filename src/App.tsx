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
} from "./pages";

import * as RoutePath from "./RouteConfig";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./assets/css/all.min.css";
import "./assets/css/site.ar.css";
import "./assets/fonts/index.css";
import { useStore } from "./utils/store";
import { Project } from "./data/projects";

function App() {
	const language = useStore((state) => state.language);

	return (
		<>
			{/* <WebSession /> */}
			<Router basename="/portal">
				<Routes>
					<Route
						path={RoutePath.ROOT}
						element={
							<MainLayout>
								<LandingPage />
							</MainLayout>
						}
					/>
					<Route
						path={RoutePath.LOGIN}
						element={<LoginPage />}
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
					<Route
						path={RoutePath.PROJECT}
						element={
							<Layout>
								<ProjectManagementHomePage />
							</Layout>
						}
					/>
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
								<Layout projectId={Project.Honors}>
									<HonorsHomePage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.HONORS_NEW}`}
							element={
								<Layout projectId={Project.Honors}>
									<HonorNewPage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.HONORS_EDIT}`}
							element={
								<Layout projectId={Project.Honors}>
									<HonorEditPage />
								</Layout>
							}
						/>
					</Route>
					{/* News */}
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.NEWS}`}
							element={
								<Layout
									projectId={Project.News}
									privilegeType={"Read"}>
									<NewsHomePage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.NEWS}/new`}
							element={
								<Layout
									projectId={Project.News}
									privilegeType="Write">
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
									projectId={Project.News}
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
									projectId={Project.PhoneDirectory}
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

			<ToastContainer
				rtl={language !== "ar" ? true : false}
				position="top-center"
				autoClose={1500}
				hideProgressBar
				pauseOnFocusLoss={false}
				pauseOnHover={false}
			/>
		</>
	);
}

export default App;
