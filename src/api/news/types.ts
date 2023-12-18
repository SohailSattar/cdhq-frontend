import { Id } from "../../utils";
import { APIDepartmentItem } from "../departments/types";
import { APIPaginate } from "../types";

export interface APINews {
	id: number;
	title: string;
	shortSummary: string;
	imageName: string;
	newsDate: Date;
	department?: APIDepartmentItem;
}

export interface APINewsDetail {
	id: number;
	title: string;
	shortSummary: string;
	imageName: string;
	videoName: string;
	newsType: APINewsType;
	department: APIDepartmentItem;
	fullNews: string;
	newsDate: Date;
	createdBy: string;
	createdOn: string;
	updatedBy: string;
	updatedOn: string;
}

export interface APINewNews {
	departmentId: Id;
	title: string;
	shortSummary: string;
	// imageName: string;
	thumbnail: File;
	videoFile: File;
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

export interface APIUpdateNewsVideo {
	id: string;
	videoFile: File;
}

export interface APINewsType {
	id: number;
	name: string;
	nameEnglish: string;
}

export interface APIPaginatedNews extends APIPaginate {
	news: APINews[];
}
