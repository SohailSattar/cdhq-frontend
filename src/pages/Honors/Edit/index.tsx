import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	HonorForm,
	IHonorFormInputs,
	PageContainer,
} from "../../../components";
import { getHonorDetail } from "../../../api/honors/get/getHonorDetail";
import { APIHonorDetail } from "../../../api/honors/types";

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
		<PageContainer title="Edit">
			<HonorForm
				data={honor}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={honorupdateClickHandler}
			/>
		</PageContainer>
	);
};

export default HonorEditPage;
