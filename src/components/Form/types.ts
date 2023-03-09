import { DropdownOption } from "../Dropdown";

export type FormMode = "ADD" | "EDIT";

export interface ILoginFormInputs {
	userName: string;
	password: string;
}

export interface IPasswordFormInputs {
	password: string;
	password2: string;
}

export interface IProjectFormInputs {
	name: string;
	nameEnglish: string;
	parentProject: DropdownOption;
	projectGroup: DropdownOption;
	departmentCategory?: DropdownOption;
	withAcademy: boolean;
	hasWorkflow: boolean;
}

export interface IUserFormInputs {
	employeeNo: string;
	logName: string;
	name: string;
	nameEnglish: string;
	phone: string;
	email: string;
	department: DropdownOption;
	userClass: DropdownOption;
	rank: DropdownOption;
	password: string;
	password2: string;
}

interface IUserProjectForm {
	privilege: DropdownOption;
	workflowStart: DropdownOption;
	workflowEnd: DropdownOption;
	department: DropdownOption;
	structureType: DropdownOption;
	canGrant: boolean;
}

export interface IUserProjectFormInputs extends IUserProjectForm {
	project: DropdownOption;
}

export interface IProjectUserFormInputs extends IUserProjectForm {
	user: DropdownOption;
}

// Phone Directory
export interface IPhoneFormInputs {
	id: number;
	phone?: string;
	phone2?: string;
	phoneOffice?: string;
}

export interface INewsFormInputs {
	department: DropdownOption;
	title: string;
	shortSummary: string;
	imageName: string;
	newsType: DropdownOption;
	fullNews: string;
	thumbnail: File;
}
