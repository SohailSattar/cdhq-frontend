import { useTranslation } from "react-i18next";
import { HonorForm, IHonorFormInputs } from "../../../components";

const HonorNewPage = () => {
	const [t] = useTranslation("common");

	const submitHandler = (values: IHonorFormInputs) => {};

	return (
		<div>
			<HonorForm
				actionButtonText={t("button.save", { framework: "React" })}
				onSubmit={submitHandler}
			/>
		</div>
	);
};

export default HonorNewPage;
