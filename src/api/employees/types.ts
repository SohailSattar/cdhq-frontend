import { Id } from "../../utils";
import { APIAssignedJob } from "../assignedJobs/types";
import { APIBloodType } from "../bloodTypes/types";
import { APIClass, APIClassItem } from "../classes/types";
import { APIContractType } from "../contractType/types";
import { APICountryItem } from "../countries/types";
import { APIDepartmentItem, APIDepartmentName } from "../departments/types";
import { APIGender } from "../genders/types";
import { APIHealthStatus } from "../healthStatuses/types";
import { APIMaritalStatus } from "../maritalStatus/types";
import { APIMilitaryTrained } from "../militaryTrained/types";
import { APIMilitaryWear } from "../militaryWear/types";
import { APIActualJobMOI } from "../moi/types";
import { APINationalService } from "../nationalServices/types";
import { APIProfessionalTraining } from "../professionalTraining/types";
import { APIProfession } from "../professions/types";
import { APIQualification } from "../qualifications/types";
import { APIRank } from "../ranks/types";
import { APIRelative } from "../relatives/types";
import { APIReligion } from "../religions/types";
import { APISignatureListItem } from "../signaturesList/types";
import { APISpecialNeed } from "../specialNeeds/types";
import { APIPaginate } from "../types";
import { APIWorkGroup, APIWorkMode } from "../works/types";

export interface APIEmployeeItem {
	id: Id;
	employeeNo: number;
	name: string;
	nameEnglish: string;
	// classId: number;
	department?: APIDepartmentItem;
	class?: APIClass;
	rank?: APIRank;
	status: APIEmployeeStatus;
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

export interface APIEmployeeListItem {
	id: Id;
	employeeNo: number;
	rank: APIRank;
	name: string;
	nameEnglish: string;
	age: number;
	status: APIEmployeeStatus;
	department: APIDepartmentName;
	section: APIDepartmentName;
	class: APIClassItem;
	militaryCardExpirtyDate: Date;
	nationality: APICountryItem;
	gender: APIGender;
	profession: APIProfession;
	assignedJob: APIAssignedJob;
}

export interface APIEmployeeDetail {
	id: Id;
	employeeNo: string;
	name: string;
	nameEnglish: string;
	class: APIClassItem;
	hireDate: string;
	joinDate: string;
	rank: APIRank;
	contractType: APIContractType;
	profession: APIProfession;
	nationality: APICountryItem;
	nationalService: APINationalService;
	nationalServiceGroup: string;
	status: APIEmployeeStatus;
	statusDetail: string;
	statusDate: string;
	militaryCardExpiryDate: Date;
	///////////////////////////////////////////////
	department: APIDepartmentName;
	section: APIDepartmentName;
	professionalTraining: APIProfessionalTraining;
	workMode: APIWorkMode;
	workGroup: APIWorkGroup;
	signList: APISignatureListItem;
	actJobMOI: APIActualJobMOI;
	assignedJob: APIAssignedJob;
	militaryTrain: APIMilitaryTrained;
	militaryWear: APIMilitaryWear;
	///////////////////////////////////////////////
	qualification: APIQualification;
	degreeDate: string;
	degreeName: string;
	degreeCountry: APICountryItem;
	universityName: string;
	///////////////////////////////////////////////
	residenceEmirate: string;
	residenceCity: string;
	residenceArea: string;
	phone: string;
	phone2: string;
	phoneOffice: string;
	emailLan: string;
	emailNet: string;
	//////////////////////////////
	gender: APIGender;
	maritalStatus: APIMaritalStatus;
	religion: APIReligion;
	birthDate: string;
	birthPlace: string;
	specialNeed: APISpecialNeed;
	healthStatus: APIHealthStatus;
	passportNo: string;
	familyBookNo: string;
	emiratesIdNo: string;
	uidNo: string;
	districtNo: string;
	districtName: string;
	lastMedicalTestDate: string;
	bloodType: APIBloodType;
	height: string;
	weight: string;
	notes: string;
	//////////////////////////////
	emergencyCallName: string;
	emergencyCallRelation: APIRelative;
	emergencyCallPhone: string;
	emergencyCallAddress: string;
	emergencyOtherContact: string;
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

export interface APIPaginatedEmployees extends APIPaginate {
	employees: APIEmployeeListItem[];
}
