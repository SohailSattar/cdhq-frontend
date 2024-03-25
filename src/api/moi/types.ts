import { Id } from "../../utils";

export interface APIJobCategory {
	id: Id;
	name: string;
	nameEnglish: string;
}

export interface APIActualJobMOI {
	id: Id;
	name: string;
	JobDetailId: Id;
	groupId: Id;
}
