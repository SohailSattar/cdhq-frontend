import { Button } from "@material-ui/core";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import localStorageService from "../../network/localStorageService";
import { useStore } from "../../utils/store";

interface Props {
	className?: string;
}

const ChangeLanguage: FC<Props> = ({ className }) => {
	const [, i18n] = useTranslation("common");

	const toggleLanguage = useStore((state) => state.language);
	const setToggleLanguage = useStore((state) => state.setLanguage);

	// if(localStorageService.getLanguage === null){}

	useEffect(() => {
		if (toggleLanguage === "") {
			let languageToChange = localStorageService.getLanguage();

			if (languageToChange === null || languageToChange !== "en") {
				languageToChange = "en";
			} else {
				languageToChange = "ar";
			}

			setToggleLanguage(languageToChange);
		}
	}, [setToggleLanguage, toggleLanguage]);

	const changeLanguageHandler = () => {
		if (toggleLanguage === "en") {
			setToggleLanguage("ar");
			i18n.changeLanguage("en");
			localStorageService.setLanguage("en");
		} else {
			setToggleLanguage("en");
			i18n.changeLanguage("ar");
			localStorageService.setLanguage("ar");
		}
		localStorageService.setLanguage(toggleLanguage);
	};

	return (
		<Button
			onClick={changeLanguageHandler}
			className={className}>
			{toggleLanguage === "ar" ? "العربية" : "EN"}
		</Button>
	);
};

export default ChangeLanguage;
