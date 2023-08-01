import { ROLE } from "../utils";

const headerLinks = [
	{
		short: "userAccount",
		url: "/user",
		displayFor: [ROLE.SUPERADMIN.toString(), ROLE.ADMIN.toString()],
	},
	{
		short: "projectManagement",
		url: "/project",
		displayFor: [ROLE.SUPERADMIN.toString()],
	},
	{
		short: "menuManagement",
		url: "/project",
		displayFor: [ROLE.SUPERADMIN.toString()],
	},
];

export default headerLinks;
