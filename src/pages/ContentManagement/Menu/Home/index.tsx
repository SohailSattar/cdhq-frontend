import { MenuTable, PageContainer } from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";

const MenuHomeSettingsPage = () => {
	return (
		<PageContainer
			showAddButton
			btnAddUrlLink={RoutePath.CONTENT_MANAGEMENT_MENU_NEW}>
			<MenuTable />
		</PageContainer>
	);
};

export default MenuHomeSettingsPage;
