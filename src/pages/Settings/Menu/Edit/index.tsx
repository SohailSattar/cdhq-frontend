import { useTranslation } from "react-i18next";
import { IMenuFormInputs, MenuForm } from "../../../../components";
import { useEffect, useState } from "react";
import { getMenuDetails } from "../../../../api/menu/get/getMenuDetails";
import { APIMenuItemDetail } from "../../../../api/menu/types";

const MenuEditSettingsPage = () => {
	const [t] = useTranslation("common");

	const [details, setDetails] = useState<APIMenuItemDetail>();

	useEffect(() => {
		const fetch = async () => {
			const { data } = await getMenuDetails(1);
			if (data) {
				setDetails(data!);
				console.log(data);
			}
		};

		fetch();
	}, []);

	return (
		<>
			<MenuForm
				data={details}
				actionButtonText={t("button.update", { framework: "React" })}
				onSubmit={function (data: IMenuFormInputs): void {
					throw new Error("Function not implemented.");
				}}
			/>
		</>
	);
};

export default MenuEditSettingsPage;
