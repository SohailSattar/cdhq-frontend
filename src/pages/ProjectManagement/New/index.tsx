import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageContainer, ProjectForm } from "../../../components";
import { addProject } from "../../../api/projects/add/addProject";
import { APINewProject } from "../../../api/projects/types";
import { IProjectFormInputs } from "../../../components/Form/types";
import { useTranslation } from "react-i18next";

import * as RoutePath from "../..//../RouteConfig";

const ProjectNewPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const submitHandler = async (values: IProjectFormInputs) => {
		const {
			name,
			nameEnglish,
			parentProject,
			projectGroup,
			departmentCategory,
			withAcademy,
			hasWorkflow,
			pathLink,
			isExternalPath,
			thumbnail,
		} = values;

		const params: APINewProject = {
			name: name,
			nameEnglish: nameEnglish,
			parentId: +parentProject?.value!,
			projectGroupId: +projectGroup?.value!,
			departmentCategoryId: +departmentCategory?.value!,
			withAcademy: withAcademy,
			hasWorkflow: hasWorkflow,
			pathLink: pathLink,
			isExternalPath: isExternalPath,
			thumbnail: thumbnail,
		};

		const { data } = await addProject(params);
		if (data) {
			toast.success(
				t("message.projectAdded", { framework: "React" }).toString()
			);
			navigate(
				`${RoutePath.PROJECT_DETAIL.replace(
					RoutePath.ID,
					data.id?.toString()!
				)}/${data.id}`
			);
		}
	};

	return (
		<PageContainer showBackButton btnBackUrlLink={RoutePath.PROJECT}>
			<ProjectForm
				onSubmit={submitHandler}
				actionButtonText={t("button.add", { framework: "React" })}
			/>
		</PageContainer>
	);
};

export default ProjectNewPage;
