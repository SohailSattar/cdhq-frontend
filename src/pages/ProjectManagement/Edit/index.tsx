import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProjectDetail } from "../../../api/projects/get/getProjectDetail";
import {
	APIProjectDetail,
	APIUpdateProject,
	APIUpdateProjectThumbnail,
} from "../../../api/projects/types";
import { updateProject } from "../../../api/projects/update/updateProject";
import { updateProjectThumbnail } from "../../../api/projects/update/updateProjectThumbnail";
import { ProjectForm } from "../../../components";
import { IProjectFormInputs } from "../../../components/Form/types";

const ProjectEditPage = () => {
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

	const imageUploadHandler = async (image: File) => {
		const params: APIUpdateProjectThumbnail = {
			id: id!,
			thumbnail: image,
		};

		const { data } = await updateProjectThumbnail(params);
		console.log(data);
		if (data) {
			// toast.success(
			// 	t("message.projectUpdated", { framework: "React" }).toString()
			// );
		}
	};

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
		} = values;

		const params: APIUpdateProject = {
			id: id!,
			name: name,
			nameEnglish: nameEnglish,
			parentId: +parentProject?.value!,
			projectGroupId: +projectGroup?.value!,
			departmentCategoryId: +departmentCategory?.value!,
			withAcademy: withAcademy,
			hasWorkflow: hasWorkflow,
			pathLink: pathLink,
			isExternalPath: isExternalPath,
		};

		const { data } = await updateProject(params);
		if (data) {
			toast.success(
				t("message.projectUpdated", { framework: "React" }).toString()
			);
		}
	};

	return (
		<ProjectForm
			data={project}
			onSubmit={submitHandler}
			onImageUpload={imageUploadHandler}
			actionButtonText={t("button.update", { framework: "React" }).toString()}
		/>
	);
};

export default ProjectEditPage;
