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

				setProjects(data);
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
			{passwordValidity.expiringInDays > 0 &&
				passwordValidity.expiringInDays <= 10 && (
					<PasswordExpiryMessage
						expiringIn={passwordValidity.expiringInDays}
						url={RoutePath.CHANGE_PASSWORD}
					/>
				)}
			<Welcome
				name={language !== "ar" ? loggedInUser.name : loggedInUser.nameEnglish}
				role={loggedInUser.role}
			/>
			<Hr />
			{isLoading ? <Loading /> : <ProjectBoxList data={projects} />}
		</div>
	);
};

export default HomePage;
