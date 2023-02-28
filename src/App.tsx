import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import {
	NewUserPage,
	HomePage,
	LoginPage,
	ProjectDetailPage,
	ProjectManagementHomePage,
	UserDetailPage,
	UsersHomePage,
	EditUserPage,
	PageNotFound,
	NewProjectPage,
	EditProjectPage,
	AssignUserToProjectPage,
	EditUserProjectPage,
	SearchUserPage,
	ChangePasswordPage,
	AssignProjectToUserPage,
	EditProjectUserPage,
	PhoneDirectory,
	NewsCreatePage,
	NewsHomePage,
	NewsEditPage,
	NewsDetailPage,
} from "./pages";
import { Layout, ProtectedRoute } from "./components";

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
					<Route path="/login" element={<LoginPage />} />
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
							path="/"
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
							path={`${RoutePath.USER}/new`}
							element={
								<Layout>
									<NewUserPage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.USER}/new/:id`}
							element={
								<Layout>
									<NewUserPage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.USER}/search`}
							element={
								<Layout>
									<SearchUserPage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.USER}/:id/edit`}
							element={
								<Layout>
									<EditUserPage />
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
							path={`${RoutePath.PROJECT}/new`}
							element={
								<Layout>
									<NewProjectPage />
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
									<EditProjectPage />
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

					{/* News */}
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.NEWS}`}
							element={
								<Layout projectId={Project.News} privilegeType={"Read"}>
									<NewsHomePage />
								</Layout>
							}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.NEWS}/new`}
							element={
								<Layout projectId={Project.News} privilegeType="Write">
									<NewsCreatePage />
								</Layout>
							}
						/>
					</Route>
					<Route
						path={`${RoutePath.NEWS}/:id`}
						element={
							<Layout>
								<NewsDetailPage />
							</Layout>
						}
					/>
					<Route element={<ProtectedRoute />}>
						<Route
							path={`${RoutePath.NEWS}/:id/edit`}
							element={
								<Layout projectId={Project.News} privilegeType="Update">
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
								<Layout projectId={Project.PhoneDirectory} privilegeType="Read">
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
