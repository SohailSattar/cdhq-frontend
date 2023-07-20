import { APIClass } from "../../../../api/classes/types";
import { APIRank } from "../../../../api/ranks/types";
import { Id } from "../../../../utils";

export interface ExistingUserTable {
	id: Id;
	logName: string;
	employeeNo: number;
	rank: APIRank;
	name: string;
	nameEnglish: string;
	// department:
	// recruiter: APIClass;
}
