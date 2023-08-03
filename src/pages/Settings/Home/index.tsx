import { useTranslation } from "react-i18next";
import {
	MenuTable,
	PageContainer,
	ShadowedContainer,
	Tab,
	TabList,
	TabPanel,
	Tabs,
} from "../../../components";
import { ROLE } from "../../../utils";

import styles from "./styles.module.scss";

const SettingsHomePage = () => {
	const [t] = useTranslation("common");

	return (
		<PageContainer
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			className={styles.settingsHome}>
			<Tabs>
				<TabList>
					<Tab>{t("menu.list", { framework: "React" })} </Tab>
				</TabList>
				<TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<MenuTable />
					</ShadowedContainer>
				</TabPanel>
			</Tabs>
		</PageContainer>
	);
};

export default SettingsHomePage;
