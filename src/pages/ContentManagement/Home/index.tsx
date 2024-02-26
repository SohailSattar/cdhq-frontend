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
import {
	CDBuildingsHomeContentManagementPage,
	ImageHomeContentManagementPage,
	MenuHomeSettingsPage,
	QRCodeHomeContentManagementPage,
} from "..";
import { useEffect, useMemo, useState } from "react";
import { APIPrivileges } from "../../../api/privileges/type";
import { getProjectPrivilege } from "../../../api/userProjects/get/getProjectPrivilege";
import { Project } from "../../../data/projects";

const SettingsHomePage = () => {
	const [t] = useTranslation("common");

	const [privileges, setPrivileges] = useState<APIPrivileges>();

	const checkPrivilege = useMemo(
		() => async () => {
			const { data: privilege } = await getProjectPrivilege(
				Project.ContentManagement
			);

			if (privilege) {
				const {
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				} = privilege;

				setPrivileges({
					readPrivilege,
					insertPrivilege,
					updatePrivilege,
					deletePrivilege,
				});
			}
		},
		[]
	);

	useEffect(() => {
		checkPrivilege();
	}, [checkPrivilege]);

	return (
		<PageContainer
			displayContent={privileges?.readPrivilege!}
			lockFor={[ROLE.ADMIN, ROLE.USER]}
			className={styles.settingsHome}>
			<Tabs>
				<TabList>
					<Tab>{t("tab.menuList", { framework: "React" })} </Tab>
					{/* <Tab>{t("linkType.name", { framework: "React" })}</Tab> */}
					<Tab>{t("tab.imagesVideos", { framework: "React" })}</Tab>
					<Tab>{t("tab.qrCodes", { framework: "React" })}</Tab>
					<Tab>{t("cd.buildings", { framework: "React" })}</Tab>
				</TabList>
				<TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<MenuHomeSettingsPage />
					</ShadowedContainer>
				</TabPanel>
				{/* <TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<LinkTypesHomeContentManagementPage />
					</ShadowedContainer>
				</TabPanel> */}
				<TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<ImageHomeContentManagementPage />
					</ShadowedContainer>
				</TabPanel>
				<TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<QRCodeHomeContentManagementPage />
					</ShadowedContainer>
				</TabPanel>
				<TabPanel>
					<ShadowedContainer className={styles.tabContainer}>
						<CDBuildingsHomeContentManagementPage />
					</ShadowedContainer>
				</TabPanel>
			</Tabs>
		</PageContainer>
	);
};

export default SettingsHomePage;
