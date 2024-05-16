import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { updatePassword } from "../../api/users/update/updatePassword";
import {
	PageContainer,
	PasswordBox,
	ShadowedContainer,
} from "../../components";
import { useStore } from "../../utils/store";
import { useState } from "react";

const ChangePasswordPage = () => {
	const [t] = useTranslation("common");

	const { id } = useStore((state) => state.loggedInUser);

	const [errors, setErrors] = useState<string[]>([]);

	const passwordUpdateClickHandler = async (password: string) => {
		const params = {
			userId: id!.toString(),
			password: password,
		};
		const { data, error } = await updatePassword(params);

		if (data) {
			if (data.success === false) {
				setErrors(data.errors!);
			} else {
				toast.success(
					t("message.passwordUpdated", { framework: "React" }).toString()
				);
			}
		}
	};

	return (
		<PageContainer errors={errors}>
			<ShadowedContainer>
				<PasswordBox onClick={passwordUpdateClickHandler} />
			</ShadowedContainer>
		</PageContainer>
	);
};

export default ChangePasswordPage;
