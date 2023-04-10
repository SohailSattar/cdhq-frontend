import { Id } from "../../utils";
import { APIDepartmentItem } from "../departments/types";
import { APIPaginate } from "../types";

export interface APINews {
	id: number;
	title: string;
	shortSummary: string;
	imageName: string;
	newsDate: Date;
}

export interface APINewsDetail {
	id: number;
	title: string;
	shortSummary: string;
	imageName: string;
	newsType: APINewsType;
	department: APIDepartmentItem;
	fullNews: string;
	newsDate: Date;
}

export interface APINewNews {
	departmentId: Id;
	title: string;
	shortSummary: string;
	// imageName: string;
	thumbnail: File;
	newsTypeId: number;
	fullNews: string;
}

export interface APIUpdateNews {
	id: string;
	departmentId: Id;
	title: string;
	shortSummary: string;
	newsTypeId: number;
	fullNews: string;
}

export interface APIUpdateNewsImage {
	id: string;
	thumbnail: File;
}

export interface APINewsType {
	id: number;
	name: string;
	nameEnglish: string;
}

export interface APIPaginatedNews extends APIPaginate {
	news: APINews[];
}
