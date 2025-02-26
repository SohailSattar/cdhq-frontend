import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
	PageContainer,
	ProjectForm,
	IProjectFormInputs,
	Modal,
} from "../../../components";
import { addProject } from "../../../api/projects/add/addProject";
import { APINewProject } from "../../../api/projects/types";
import { useTranslation } from "react-i18next";

import * as RoutePath from "../..//../RouteConfig";
import { ProjectPreview } from "../../../components/Preview";
import { useState } from "react";
import { ROLE } from "../../../utils";

const ProjectNewPage = () => {
	const [t] = useTranslation("common");
	const navigate = useNavigate();

	const [details, setDetails] = useState<IProjectFormInputs>();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const previewHandler = async (values: IProjectFormInputs) => {
		setDetails(values);
		setIsOpen(true);
	};

	const submitHandler = async () => {
		setIsOpen(false);

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
			displayOnDashboard,
		} = details!;

		const params: APINewProject = {
			name: name,
			nameEnglish: nameEnglish,
			parentId: parentProject?.value!,
			projectGroupId: +projectGroup?.value!,
			departmentCategoryId: +departmentCategory?.value!,
			withAcademy: withAcademy,
			hasWorkflow: hasWorkflow,
			pathLink: pathLink,
			isExternalPath: isExternalPath,
			thumbnail: thumbnail,
			isActive: displayOnDashboard,
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
				)}`
			);
		}
	};

	return (
		<PageContainer
			title={t("page.projectNew", { framework: "React" })}
			showBackButton
			btnBackUrlLink={RoutePath.PROJECT}
			lockFor={[ROLE.ADMIN, ROLE.USER]}>
			<ProjectForm
				onSubmit={previewHandler}
				actionButtonText={t("button.add", { framework: "React" })}
			/>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}>
				<ProjectPreview
					data={details!}
					onClick={submitHandler}
				/>
			</Modal>
		</PageContainer>
	);
};

export default ProjectNewPage;
