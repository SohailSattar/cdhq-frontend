import { APIPaginate } from "../types";

export interface APINews {
	id: number;
	title: string;
	shortSummary: string;
}

export interface APINewsDetail extends APINews {
	// imageName: string;
	thumbnail: File;
	newsType: APINewsType;
	fullNews: string;
	newsDate: Date;
}

export interface APINewNews {
	title: string;
	shortSummary: string;
	// imageName: string;
	thumbnail: File;
	newsTypeId: number;
	fullNews: string;
}

export interface APIUpdateNews {
	id: string;
	title: string;
	shortSummary: string;
	// imageName: string;
	thumbnail: File;
	newsTypeId: number;
	fullNews: string;
}

export interface APINewsType {
	id: number;
	name: string;
	nameEnglish: string;
}

export interface APIPaginatedNews extends APIPaginate {
	news: APINews[];
}
