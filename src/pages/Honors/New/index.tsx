import { useTranslation } from "react-i18next";
import {
	HonorForm,
	IHonorFormInputs,
	PageContainer,
} from "../../../components";
import { useEffect, useMemo, useState } from "react";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";

const HonorNewPage = () => {
	const [t] = useTranslation("common");
	const [canView, setCanView] = useState(false);

	const fetchDetails = useMemo(
		() => async () => {
			// check if user can get details
			const { data: privilege } = await getProjectPrivilege(Project.Honors);

			if (!privilege?.insertPrivilege) {
				setCanView(false);
				return;
			} else {
				setCanView(true);
			}

			// get the details.
		},
		[]
	);

	useEffect(() => {
		// if (
		// 	(role === ROLE.USER || role === "" || role === ROLE.ADMIN) &&
		// 	(loggedUserId.toString() !== id || loggedUserId === 0)
		// ) {
		// 	navigate(RoutePath.USER);
		// } else {
		// 	setCanView(true);
		// }
		fetchDetails();
	}, [fetchDetails]);

	const submitHandler = (values: IHonorFormInputs) => {};

	return (
		<PageContainer displayContent={canView}>
			<HonorForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default HonorNewPage;
