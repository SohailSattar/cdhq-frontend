import { APIPaginate } from "..";
import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import { APIDepartmentItem } from "../departments/types";

export interface APIHonor {
	id: number;
	name: string;
	nameEnglish: string;
	imageName: string;
	work: string;
	workEnglish: string;
	rank: string;
	rankEnglish: string;
	department: APIDepartmentItem;
	type: string;
	activeStatus: APIActiveStatus;
}

export interface APIPaginatedHonors extends APIPaginate {
	honors: APIHonor[];
}

export interface APINewHonor {
	employeeId: Id;
	honorType: number;
	thumbnail: File;
}

export interface APIUpdateHonor {
	id: Id;
	honorType: number;
}

export interface APIUpdateHonorImage {
	id: string;
	thumbnail: File;
}
