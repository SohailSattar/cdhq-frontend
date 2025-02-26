import { APIActiveStatus } from "../activeStatus/types";
import { APIClass } from "../classes/types";
import { APIDepartmentItem } from "../departments/types";
import { APIRank } from "../ranks/types";
import { APIRole } from "../roles/types";
import { APIPaginate } from "../types";

export interface APIPasswordValidity {
	passwordSetOn?: Date;
	passwordExpiringOn?: Date;
	expiringInDays: number;
}

export interface APIUserName {
	id: number;
	logName: string;
	name: string;
	nameEnglish: string;
	employeeNo: string;
	department: APIDepartmentItem;
	activeStatus: APIActiveStatus;
}

export interface APIUser {
	id: number;
	employeeNo: string;
	logName: string;
	name: string;
	nameEnglish: string;
}

export interface APIUserItem {
	id: number;
	employeeNo: string;
	logName: string;
	name: string;
	nameEnglish: string;
	roleId: number;
}

export interface APILoggedUser {
	id: number;
	userName: string;
	name: string;
	nameEnglish: string;
	role: string;
}

export interface APIUserDetail extends APIUser {
	department?: APIDepartmentItem;
	class: APIClass;
	rank: APIRank;
	role?: APIRole;
	phone: string;
	email: string;
	activeStatus?: APIActiveStatus;
	createdBy: string;
	createdOn: string;
	updatedBy: string;
	updatedOn: string;
}

export interface APIExistingUser extends APIUser {
	department: APIDepartmentItem;
	rank: APIRank;
	class: APIClass;
}

export interface APIPaginatedUser extends APIPaginate {
	users: APIUserName[];
}

export interface APIUserIdLogName {
	id: number;
	logName: string;
	roleId: number;
}

export interface APINewUser {
	id: string;
	employeeNo: string;
	logName: string;
	name: string;
	nameEnglish: string;
	departmentId: number;
	phone: string;
	classId: number;
	rankId: number;
	email: string;
	password: string;
}

export interface APIUpdateUser {
	id: number;
	logName: string;
	name: string;
	nameEnglish: string;
	phone: string;
	email: string;
	departmentId: string;
	classId: string;
	rankId: string;
}

export interface APILoginUser {
	userId: string;
	password: string;
}

export interface APIUserRole {
	id: string;
	role: APIRole;
}

export interface APIUpdateUserRole {
	userId: string;
	roleId: string;
}

export interface APIUpdateUserStatus {
	userId: string;
	activeStatusId: number;
}

export interface APIEmployeeUpdateStatus {
	updateAvailable: boolean;
}

export interface APISyncUser {
	id: string;
}

//////////////////// EXPORT API ////////////////////////
export interface APIExportUser {
	id: number;
	employeeNo: number;
	name: string;
	nameEnglish: string;
	logName: string;
	rank: string;
	department: string;
	phone: string;
	email: string;
}
