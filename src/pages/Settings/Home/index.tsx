import { useTranslation } from "react-i18next";
import {
	PageContainer,
	ShadowedContainer,
	Tab,
	TabList,
	TabPanel,
	Tabs,
} from "../../../components";
import { ROLE } from "../../../utils";

import styles from "./styles.module.scss";
import { LinkTypesHomeSettingsPage, MenuHomeSettingsPage } from "..";

const SettingsHomePage = () => {
	const [t] = useTranslation("common");

	return (
		<PageContainer
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			className={styles.settingsHome}>
			<Tabs>
				<TabList>
					<Tab>{t("menu.list", { framework: "React" })} </Tab>
					<Tab>{t("linkType.name", { framework: "React" })}</Tab>
				</TabList>
				<TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<MenuHomeSettingsPage />
					</ShadowedContainer>
				</TabPanel>
				<TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<LinkTypesHomeSettingsPage />
					</ShadowedContainer>
				</TabPanel>
			</Tabs>
		</PageContainer>
	);
};

export default SettingsHomePage;
