import { useTranslation } from "react-i18next";
import {
	HonorForm,
	IHonorFormInputs,
	PageContainer,
} from "../../../components";

const HonorNewPage = () => {
	const [t] = useTranslation("common");

	const submitHandler = (values: IHonorFormInputs) => {};

	return (
		<PageContainer displayContent={false}>
			<HonorForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</PageContainer>
	);
};

export default HonorNewPage;
