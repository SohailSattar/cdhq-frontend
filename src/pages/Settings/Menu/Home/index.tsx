import { MenuTable, PageContainer } from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";

const MenuHomeSettingsPage = () => {
	return (
		<PageContainer
			showAddButton
			btnAddUrlLink={RoutePath.SETTINGS_MENU_NEW}>
			<MenuTable />
		</PageContainer>
	);
};

export default MenuHomeSettingsPage;
