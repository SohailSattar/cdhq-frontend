import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProjectForm } from "../../../components";
import { addProject } from "../../../api/projects/add/addProject";
import { APINewProject } from "../../../api/projects/types";
import { IProjectFormInputs } from "../../../components/Form/types";
import { useTranslation } from "react-i18next";

import * as RoutePath from "../..//../RouteConfig";

const NewProject = () => {
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
			thumbnail: thumbnail,
		};

		const { data } = await addProject(params);
		if (data) {
			toast.success(
				t("message.projectAdded", { framework: "React" }).toString()
			);
			navigate(`${RoutePath.PROJECT}/${data.id}`);
		}
	};

	return (
		<ProjectForm
			onSubmit={submitHandler}
			actionButtonText={t("button.add", { framework: "React" })}
		/>
	);
};

export default NewProject;
