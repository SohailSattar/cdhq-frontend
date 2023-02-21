import { APIClass } from '../classes/types';
import { APIDepartmentItem } from '../departments/types';
import { APIGender } from '../genders/type';
import { APIRank } from '../ranks/types';

export interface APIEmployee {
	id: number;
	employeeNo: number;
	fullName: string;
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
}

export interface APIExistingEmployee {
	id: number;
	employeeNo: string;
	fullName: string;
	nameEnglish: string;
	phone?: string;
	email?: string;
	// classId: number;
	department?: APIDepartmentItem;
	class?: APIClass;
	rank?: APIRank;
}
