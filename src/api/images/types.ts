import { APIPaginate } from "..";
import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import { APIType } from "../imageType/types";

export interface APIImage {
	id: Id;
	name: string;
	nameEnglish: string;
	imageName: string;
	videoName: string;
	imageType: APIType;
	stars?: number;
	activeStatus?: APIActiveStatus;
}
export interface APIImageDetail {
	id: Id;
	name: string;
	nameEnglish: string;
	imageName: string;
	videoName: string;
	imageType: APIType;
	stars?: number;
}

export interface APIVideo {
	id: Id;
	name: string;
	nameEnglish: string;
	imageName: string;
	videoName: string;
}

// export interface APIItem {
// 	id: Id;
// 	name: string;
// 	nameEnglish: string;
// 	imageName: string;
// 	imageType: APIImageType;
// 	stars?: number;
// }

export interface APIPaginatedImage extends APIPaginate {
	images: APIImage[];
}

export interface APINewImage {
	name: string;
	nameEnglish: string;
	imageTypeId: Id;
	stars?: number;
	thumbnail: File;
	videoFile: File;
}

export interface APIUpdateImageDetail {
	id: Id;
	name: string;
	nameEnglish: string;
	imageTypeId: Id;
	stars?: number;
}

export interface APIUpdateImage {
	id: Id;
	thumbnail: File;
}
