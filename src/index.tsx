import React from "react";
import ReactDOM from "react-dom/client";
import Setup from "./context/Setup";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import localStorageService from "./network/localStorageService";

import common_ar from "./translations/ar/common.json";
import common_en from "./translations/en/common.json";

import "./index.css";

let lng = localStorageService.getLanguage();

if (lng === null || lng !== "en") {
	lng = "ar";
	localStorageService.setLanguage("ar");
}

i18next.init({
	interpolation: { escapeValue: false }, // React already does escaping
	lng: lng, // language to use
	resources: {
		en: {
			common: common_en, // 'common' is our custom namespace
		},
		ar: {
			common: common_ar,
		},
	},
});

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<I18nextProvider i18n={i18next}>
			<Setup />
		</I18nextProvider>
	</React.StrictMode>
);
