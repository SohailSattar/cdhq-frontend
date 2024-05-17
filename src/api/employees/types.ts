import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
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
	photo: string;
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
	militaryCardExpiryDate: string;
	///////////////////////////////////////////////
	department: APIDepartmentName;
	section: APIDepartmentName;
	isWorkLocationManager: boolean;
	professionalTraining: APIProfessionalTraining;
	workMode: APIWorkMode;
	workGroup: APIWorkGroup;
	signList: APISignatureListItem;
	actJobMOI: APIActualJobMOI;
	assignedJob: APIAssignedJob;
	additionalJob?: string;
	previousExperienceYear: string;
	previousExperienceMonth: string;
	previousExperienceDay: string;
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
	emergencyCallRelation: string;
	emergencyCallPhone: string;
	emergencyCallAddress: string;
	emergencyOtherName: string;
	emergencyOtherRelation: string;
	emergencyOtherPhone: string;
	emergencyOtherAddress: string;
	//////////////////////////////
	activeStatus: APIActiveStatus;
	createdBy: string;
	createdOn: string;
	updatedBy: string;
	updatedOn: string;
}

export interface APIEmployeeHistory {
	name: string;
	updatedBy?: string;
	fieldName?: string;
	oldValue?: string;
	newValue?: string;
	auditDate: string;
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

export interface APINewEmployee {
	thumbnail: File;
	employeeNo: string;
	name: string;
	nameEnglish: string;
	classId: Id;
	hireDate: string;
	joinDate: string;
	rankId: Id;
	contractTypeId: Id;
	professionId: Id;
	nationalityId: Id;
	nationalServiceId: Id;
	nationalServiceGroup?: string;
	statusId: Id;
	statusDetail?: string;
	statusDate: string;
	militaryCardExpiryDate: string;
	///////////////////////////////////////////////
	departmentId: Id;
	sectionId: Id;
	isWorkLocationManager: boolean;
	professionalTrainingId: Id;
	workModeId: Id;
	workGroupId: Id;
	signListId: Id;
	actJobMOIId: Id;
	assignedJobId: Id;
	additionalJob?: string;
	militaryTrainId: Id;
	militaryWearId: Id;
	///////////////////////////////////////////////
	qualificationId: Id;
	degreeDate: string;
	degreeName: string;
	degreeCountryId: Id;
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
	////////////////
	genderId: Id;
	maritalStatusId: Id;
	religionId: Id;
	birthDate: string;
	birthPlace: string;
	specialNeedId: Id;
	healthStatusId: Id;
	passportNo: string;
	familyBookNo?: string;
	emiratesIdNo: string;
	uidNo: string;
	districtNo?: string;
	districtName?: string;
	lastMedicalTestDate: string;
	bloodTypeId: Id;
	height?: string;
	weight?: string;
	notes?: string;
	////////////////
	emergencyCallName: string;
	emergencyCallRelation: string;
	emergencyCallPhone: string;
	emergencyCallAddress: string;
	emergencyOtherName: string;
}

export interface APIUpdateEmployee {
	id: Id;
	employeeNo: string;
	name: string;
	nameEnglish: string;
	classId: Id;
	hireDate: string;
	joinDate: string;
	rankId: Id;
	contractTypeId: Id;
	professionId: Id;
	nationalityId: Id;
	nationalServiceId: Id;
	nationalServiceGroup?: string;
	statusId: Id;
	statusDetail?: string;
	statusDate: string;
	militaryCardExpiryDate: string;
	///////////////////////////////////////////////
	departmentId: Id;
	sectionId: Id;
	isWorkLocationManager: boolean;
	professionalTrainingId: Id;
	workModeId: Id;
	workGroupId: Id;
	signListId: Id;
	actJobMOIId: Id;
	assignedJobId: Id;
	additionalJob?: string;
	militaryTrainId: Id;
	militaryWearId: Id;
	///////////////////////////////////////////////
	qualificationId: Id;
	degreeDate: string;
	degreeName: string;
	degreeCountryId: Id;
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
	////////////////
	genderId: Id;
	maritalStatusId: Id;
	religionId: Id;
	birthDate: string;
	birthPlace: string;
	specialNeedId: Id;
	healthStatusId: Id;
	passportNo: string;
	familyBookNo?: string;
	emiratesIdNo: string;
	uidNo: string;
	districtNo?: string;
	districtName?: string;
	lastMedicalTestDate: string;
	bloodTypeId: Id;
	height?: string;
	weight?: string;
	notes?: string;
	////////////////
	emergencyCallName: string;
	emergencyCallRelation: string;
	emergencyCallPhone: string;
	emergencyCallAddress: string;
	emergencyOtherName: string;
}

export interface APIUpdateEmployeePhoto {
	id: Id;
	thumbnail: File;
}

export interface APIUpdateEmployeeSignature {
	id: Id;
	thumbnail: File;
}

export interface APIPaginatedEmployees extends APIPaginate {
	employees: APIEmployeeListItem[];
}

export interface APIPaginatedEmployeeHistory extends APIPaginate {
	changes: APIEmployeeHistory[];
}

/////////////////////////////////////////////////////////
export interface APIUpdateEmployeeStatus {
	id: Id;
	activeStatusId: number;
}

//////////////////// EXPORT API ////////////////////////
export interface APIExportEmployee {
	employeeNo: number;
	rank: string;
	name: string;
	nameEnglish: string;
	age: number;
	status: string;
	department: string;
	section: string;
	class: string;
	hireDate: string;
	joinDate: string;
	contractType: string;
	profession: string;
	nationality: string;
	nationalService: string;
	militaryCardExpiryDate: string;
	professionalTraining: string;
	workMode: string;
	workGroup: string;
	degreeCountry: string;
	assignedJob: string;
	militaryTrain: string;
	militaryWear: string;
	qualification: string;
	degreeDate: string;
	degreeName: string;
	universityName: string;
	residenceEmirate: string;
	phone: string;
	phoneOffice: string;
	emailNet: string;
	gender: string;
	maritalStatus: string;
	birthDate: string;
	birthPlace: string;
	healthStatus: string;
	passportNo: string;
	emiratesIdNo: string;
	districtName: string;
	bloodType: string;
	notes: string;
	emergencyCallName: string;
	emergencyCallRelation: string;
	emergencyCallPhone: string;
	emergencyCallAddress: string;
	updatedOn: string;
	position: string;
}
