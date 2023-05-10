import { APIPaginate } from "..";
import { APIActiveStatus } from "../activeStatus/types";
import { APIEmployeeItem } from "../employees/types";

export interface APILeaveItem {
	id: number;
	employee: APIEmployeeItem;
	leaveDays: number;
	startDate: Date;
	endDate: Date;
	appDate: Date;
	activeStatus: APIActiveStatus;
}

export interface APIPaginatedLeaves extends APIPaginate {
	projects: APILeaveItem[];
}
