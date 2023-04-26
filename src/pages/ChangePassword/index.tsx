import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { updatePassword } from "../../api/users/update/updatePassword";
import { PasswordBox, ShadowedContainer } from "../../components";
import { useStore } from "../../utils/store";

const ChangePasswordPage = () => {
	const [t] = useTranslation("common");

	const { id } = useStore((state) => state.loggedInUser);

	const passwordUpdateClickHandler = async (password: string) => {
		const params = {
			userId: id!.toString(),
			password: password,
		};
		const { data, error } = await updatePassword(params);
		console.log(error);

		if (data) {
			toast.success(
				t("message.passwordUpdated", { framework: "React" }).toString()
			);
		}

		console.log(error);
	};

	return (
		<ShadowedContainer>
			<PasswordBox onClick={passwordUpdateClickHandler} />
		</ShadowedContainer>
	);
};

export default ChangePasswordPage;
