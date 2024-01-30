import { APIPaginate } from "..";
import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import { APIDepartmentItem } from "../departments/types";

export interface APIHonor {
	id: number;
	name: string;
	nameEnglish: string;
	imageName: string;
	// work: string;
	// workEnglish: string;
	rank: string;
	rankEnglish: string;
	department: APIDepartmentItem;
	type: string;
	activeStatus: APIActiveStatus;
	notes: string;
}

export interface APIPaginatedHonors extends APIPaginate {
	honors: APIHonor[];
}

export interface APINewHonor {
	employeeId: Id;
	honorType: number;
	thumbnail: File;
	notes: string;
}

export interface APIUpdateHonor {
	id: Id;
	honorType: number;
	notes: string;
}

export interface APIUpdateHonorImage {
	id: string;
	thumbnail: File;
}

//////////////////// EXPORT API ////////////////////////
export interface APIExportHonor {
	name: string;
	rank: string;
	department: string;
	section: string;
	honoredOn: string;
	honorType: string;
}
