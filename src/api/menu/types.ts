import { Id } from "../../utils";
import { APIPaginate } from "../types";

export interface APIMenuListItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
	children: APIMenuListItem[];
}

export interface APIMenuItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
}

export interface APIMenuItemDetail {
	id: number;
	name: string;
	nameEnglish: string;
	parent: APIMenuItem;
	linkPath: string;
	isVisible: boolean;
	orderNo: string;
}

export interface APIUpdateMenuItem {
	id: Id;
	name: string;
	nameEnglish: string;
	parentId?: Id;
	linkPath?: string;
	isVisible?: boolean;
	orderNo?: number;
}

export interface PaginatedMenuItem extends APIPaginate {
	menuItems: APIMenuItemDetail[];
}
