import {
	CivilDefenseBuildingsTable,
	PageContainer,
} from "../../../../components";

import * as RoutePath from "../../../../RouteConfig";

const CDBuildingsHomeContentManagementPage = () => {
	return (
		<PageContainer
			showAddButton
			btnAddUrlLink={RoutePath.CONTENT_MANAGEMENT_CD_BUILDING_NEW}>
			<CivilDefenseBuildingsTable />
		</PageContainer>
	);
};

export default CDBuildingsHomeContentManagementPage;
