import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import { APILinkTypeDetail, APIType } from "../linkTypes/types";
import { APIPaginate } from "../types";

export interface APIMenuListItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
	linkType?: APILinkTypeDetail;
	isExternalPath: boolean;
	children: APIMenuListItem[];
}

export interface APIMenuItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
}

export interface APIParentMenuItem {
	id: number;
	name: string;
	nameEnglish: string;
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
	menuType: APIType;
	isExternalPath: boolean;
	activeStatus: APIActiveStatus;
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
