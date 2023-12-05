import { APIPaginate } from "..";
import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";

export interface APIQRCodeItem {
	id: number;
	name: string;
	nameEnglish: string;
	imageName: string;
	iconName?: string;
	activeStatus: APIActiveStatus;
}

export interface APIPaginatedQRCodeItem extends APIPaginate {
	codes: APIQRCodeItem[];
}

export interface APIQRCodeDetail {
	id: number;
	name: string;
	nameEnglish: string;
	imageName: string;
	iconName?: string;
}

export interface APINewQRCode {
	name: string;
	nameEnglish: string;
	image: File;
	icon?: File;
}

export interface APIUpdateQRCodeDetail {
	id: Id;
	name: string;
	nameEnglish: string;
}

export interface APIUpdateQRCodeImage {
	id: Id;
	imageFile: File;
}

export interface APIUpdateQRCodeIcon {
	id: Id;
	iconFile: File;
}
