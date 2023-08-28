import { Id } from "react-toastify";
import { APIActiveStatus } from "../activeStatus/types";
import { APIPaginate } from "../types";

export interface APIType {
	id: number;
	name: string;
	nameEnglish: string;
	isFile: boolean;
}

export interface APILinkTypeDetail {
	id: number;
	name: string;
	nameEnglish: string;
	activeStatus: APIActiveStatus;
	orderNo: string;
	isFile: boolean;
}

export interface APIPaginatedLinkType extends APIPaginate {
	linkTypes: APILinkTypeDetail[];
}

export interface APIUpdateLinkType {
	id: Id;
	name: string;
	nameEnglish: string;
	isFile?: boolean;
}
