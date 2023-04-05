import React from "react";
import HeaderLogo, { Props as HeaderLogoProps } from ".";

export default {
	title: "Components/HeaderLogo",
	component: HeaderLogo,
};

export const Primary = () => <HeaderLogo src="" isLoggedIn={true} />;
