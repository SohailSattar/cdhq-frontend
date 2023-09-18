import { Id } from "../../utils";
import { APIClass } from "../classes/types";
import { APIDepartmentItem } from "../departments/types";
import { APIGender } from "../genders/type";
import { APIRank } from "../ranks/types";

export interface APIEmployeeItem {
	id: Id;
	name: string;
}

export interface APIEmployee {
	id: Id;
	employeeNo: number;
	name: string;
	nameEnglish: string;
	hireDate?: Date;
	phone?: string;
	email?: string;
	gender?: APIGender;
	classA: string;
	// classId: number;
	class?: APIClass;
	genderId: number;
	rankId: number;
	rank?: APIRank;
	department?: APIDepartmentItem;
}

export interface APIExistingEmployee {
	id: number;
	employeeNo: string;
	name: string;
	nameEnglish: string;
	phone?: string;
	email?: string;
	// classId: number;
	department?: APIDepartmentItem;
	class?: APIClass;
	rank?: APIRank;
	status: APIEmployeeStatus;
}

export interface APIEmployeeSignature {
	id: number;
	imageName?: string;
}

export interface APIEmployeeStatus {
	id: number;
	name: string;
	nameEnglish: string;
}

export interface APIUpdateEmployeeSignature {
	id: Id;
	thumbnail: File;
}
