import { Id } from "../../utils";

export interface APIImageType {
	id: Id;
	name: string;
	nameEnglish: string;
}

export interface APICreation {
	id: Id;
	name: string;
	nameEnglish: string;
	imageName: string;
	imageType: APIImageType;
	stars?: number;
}
