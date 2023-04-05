import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HonorForm from "../../../components/Form/HonorForm";
import { getHonorDetail } from "../../../api/honors/get/getHonorDetail";
import { APIHonorDetail } from "../../../api/honors/types";
import { IHonorFormInputs } from "../../../components/Form/types";

const HonorEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const [t] = useTranslation("common");

	const [honor, setHonor] = useState<APIHonorDetail>();

	const fetch = useMemo(
		() => async () => {
			const { data } = await getHonorDetail(id!);
			setHonor(data);
		},
		[id]
	);

	useEffect(() => {
		if (id) {
			fetch();
		}
	}, [id, fetch]);

	const honorupdateClickHandler = (values: IHonorFormInputs) => {
		console.log(values);
	};

	return (
		<div>
			<HonorForm
				data={honor}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={honorupdateClickHandler}
			/>
		</div>
	);
};

export default HonorEditPage;
