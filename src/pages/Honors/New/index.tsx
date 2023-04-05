import { useTranslation } from "react-i18next";
import HonorForm from "../../../components/Form/HonorForm";
import { IHonorFormInputs } from "../../../components/Form/types";

const HonorNewPage = () => {
	const [t] = useTranslation("common");

	const submitHandler = (values: IHonorFormInputs) => {
		console.log(values);
	};

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
