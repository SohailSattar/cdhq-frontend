export type Direction = "ltr" | "rtl";

export interface ItemMenu {
	name: string;
	url: string;
	subItems?: ItemMenu[];
}

export interface Message {
	text: string;
	type: "error";
	url?: string;
	urlText?: string;
}

export type PrivilegeType =
	| "Read"
	| "Write"
	| "Update"
	| "Delete"
	| "All"
	| "None";
