import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProjectDetail } from "../../../api/projects/get/getProjectDetail";
import {
	APIProjectDetail,
	APIUpdateProject,
} from "../../../api/projects/types";
import { updateProject } from "../../../api/projects/update/updateProject";
import { ProjectForm } from "../../../components";
import { IProjectFormInputs } from "../../../components/Form/types";

const EditProjectPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [project, setProject] = useState<APIProjectDetail>();

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getProjectDetail(id!);

			setProject(data);
		};

		if (id) {
			fetch();
		}
	}, [id]);

	const submitHandler = async (values: IProjectFormInputs) => {
		const {
			name,
			nameEnglish,
			parentProject,
			projectGroup,
			departmentCategory,
			hasWorkflow,
		} = values;

		const params: APIUpdateProject = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			parentId: +parentProject?.value!,
			projectGroupId: +projectGroup?.value!,
			departmentCategoryId: +departmentCategory?.value!,
			hasWorkflow: hasWorkflow,
		};

		const { data } = await updateProject(params);
		if (data) {
			toast.success(t("message.projectUpdated", { framework: "React" }));
		}
	};

	return (
		<ProjectForm
			data={project}
			onSubmit={submitHandler}
			actionButtonText={t("button.update", { framework: "React" })}
		/>
	);
};

export default EditProjectPage;
