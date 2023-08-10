import { APIPaginate } from "..";
import { Id } from "../../utils";

export interface APIHonorDetail {
	id: number;
	name: string;
	imageName: string;
	work: string;
	rank: string;
	department: string;
	type: string;
}

export interface APIPaginatedHonors extends APIPaginate {
	honors: APIHonorDetail[];
}

export interface APINewHonor {
	employeeId: Id;
	thumbnail: File;
}

export interface APIUpdateHonor {
	id: Id;
	thumbnail: File;
}

export interface APIUpdateHonorImage {
	id: string;
	thumbnail: File;
}
