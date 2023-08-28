import { Id } from "../../utils";
import { APILinkTypeDetail, APIType } from "../linkTypes/types";
import { APIPaginate } from "../types";

export interface APIMenuListItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
	linkType?: APILinkTypeDetail;
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
	linkType: APIType;
	isExternalPath: boolean;
}

export interface APIUpdateMenuItem {
	id: Id;
	name: string;
	nameEnglish: string;
	parentId?: Id;
	linkPath?: string;
	isVisible?: boolean;
	orderNo?: number;
	linkTypeId?: Id;
	file?: File;
	isExternalPath: boolean;
}

export interface APINewMenuItem {
	name: string;
	nameEnglish: string;
	parentId?: Id;
	linkPath?: string;
	isVisible?: boolean;
	orderNo?: number;
	linkTypeId?: Id;
	file?: File;
	isExternalPath: boolean;
}

export interface PaginatedMenuItem extends APIPaginate {
	menuItems: APIMenuItemDetail[];
}
