import { ROLE } from "../utils";

const headerLinks = [
	{
		short: "dashboard",
		url: "/home",
		displayFor: [ROLE.SUPERADMIN.toString(), ROLE.ADMIN.toString(), ROLE.USER],
	},
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
		short: "department",
		url: "/department",
		displayFor: [ROLE.SUPERADMIN.toString()],
	},
];

export default headerLinks;
