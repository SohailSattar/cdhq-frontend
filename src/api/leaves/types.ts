import { APIPaginate } from "..";
import { Id } from "../../utils";

export interface APILeaveItem {
	id: Id;
	employeeId: Id;
	fullName: string;
	employeeNo: number;
	rank: string;
	departmentName: string;
	startDate: Date;
	endDate: Date;
	leaveTypeArabic: string;
	leaveTypeEnglish: string;
	applicationStatus: string;
	leaveDays: number;
}

export interface APIPaginatedLeaves extends APIPaginate {
	leaves: APILeaveItem[];
}
