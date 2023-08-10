import { useEffect, useState } from "react";
import {
	Hr,
	Loading,
	PasswordExpiryMessage,
	ProjectBoxList,
	Welcome,
} from "../../components";
import { useStore } from "../../utils/store";

import { APIProjectItem } from "../../api/projects/types";
import { getAllProjectsList } from "../../api/projects/get/getAllProjectsList";

import * as RoutePath from "../../RouteConfig";

import styles from "./styles.module.scss";
import { getAccessibleProjects } from "../../api/userProjects/get/getAccessibleProjects";
import { ROLE } from "../../utils";

const HomePage = () => {
	const language = useStore((state) => state.language);

	const passwordValidity = useStore((state) => state.passwordValidity);

	const loggedInUser = useStore((state) => state.loggedInUser);

	const [isLoading, setIsLoading] = useState(true);

	const [projects, setProjects] = useState<APIProjectItem[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			// // getting user projects list
			// const { data: userProjects } = await getUserProjectsList(
			// 	loggedInUser.id!
			// );

			//Getting all projects
			const { data } = await getAllProjectsList();

			if (data) {
				const { data: accessibleProjects } = await getAccessibleProjects();

				// const x: APIProjectItem[] = data?.map((x: APIProjectItem) => {
				// 	// const isA = userProjects?.includes()

				// 	return {
				// 		id: x.id,
				// 		name: x.name,
				// 		nameEnglish: x.nameEnglish,
				// 		isAvailable: true,
				// 		iconName: x.iconName,
				// 	};
				// });

				if (loggedInUser.role !== ROLE.SUPERADMIN) {
					const projectsList = data
						.map((project) => {
							project.isAvailable = accessibleProjects?.find(
								(x) => x.id === project.id
							)
								? true
								: false;
							return project;
						})
						.sort((a, b) => +b.isAvailable! - +a.isAvailable!);

					// Forbid user to access User Accounts page even if they have been assigned it to them.
					if (loggedInUser.role === ROLE.USER) {
						const objIndex = projectsList.findIndex((obj) => obj.id === 110);

						projectsList[objIndex].isAvailable = false;

						// console.log(objIndex);
					}

					setProjects(projectsList);
				} else {
					const projectsList = data
						.map((project) => {
							project.isAvailable = true;
							return project;
						})
						.sort((a, b) => +b.isAvailable! - +a.isAvailable!);

					setProjects(projectsList);
				}
				setIsLoading(false);

				// const { data } = await getUserProjectsList(loggedInUser.id!);

				// if (data) {
				// 	setIsLoading(false);
				// 	// setProjects(data);
				// }
			}
		};

		fetchData();
	}, [loggedInUser]);

	return (
		<div className={styles.home}>
			<Welcome
				name={language !== "ar" ? loggedInUser.name : loggedInUser.nameEnglish}
				role={loggedInUser.role}
			/>
			{passwordValidity.expiringInDays > 0 &&
				passwordValidity.expiringInDays <= 10 && (
					<PasswordExpiryMessage
						expiringIn={passwordValidity.expiringInDays}
						url={RoutePath.CHANGE_PASSWORD}
					/>
				)}
			<Hr />
			{isLoading ? <Loading /> : <ProjectBoxList data={projects} />}
		</div>
	);
};

export default HomePage;
