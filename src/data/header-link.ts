import { ROLE } from "../utils";

const headerLinks = [
	{
		name: "User Account",
		short: "userAccount",
		url: "/user",
		subLinks: [{}],
		displayFor: [ROLE.SUPERADMIN.toString(), ROLE.ADMIN.toString()],
	},
	{
		name: "Project Management",
		short: "projectManagement",
		url: "/project",
		subLinks: [{}],
		displayFor: [ROLE.SUPERADMIN.toString(), ROLE.ADMIN.toString()],
	},
];

export default headerLinks;
