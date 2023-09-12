import { Id } from "../../utils";
import { DropdownOption } from "../Dropdown";

export type FormMode = "ADD" | "EDIT";

export type FileType = "image/*" | "application/pdf" | "video/mp4";

export interface ILoginFormInputs {
	userName: string;
	password: string;
}

export interface IPasswordFormInputs {
	password: string;
	password2: string;
}

export interface ILinkTypeFormInputs {
	name: string;
	nameEnglish: string;
	isFile: boolean;
}

export interface IMenuFormInputs {
	name: string;
	nameEnglish: string;
	parentProject?: DropdownOption;
	linkType: DropdownOption;
	file?: File;
	linkPath: string;
	isVisible?: boolean;
	orderNo: string;
	isExternalLink?: boolean;
}

export interface IEmployeeSignatureFormInputs {
	thumbnail?: File;
	imageName: string;
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

export interface IProjectFormInputs {
	iconName?: string;
	name: string;
	nameEnglish: string;
	parentProject?: DropdownOption;
	projectGroup: DropdownOption;
	departmentCategory?: DropdownOption;
	withAcademy: boolean;
	hasWorkflow: boolean;
	pathLink: string;
	isExternalPath: boolean;
	thumbnail: File;
	displayOnDashboard: boolean;
}

interface IUserProjectForm {
	privilege: DropdownOption;
	workflowStart: DropdownOption;
	workflowEnd: DropdownOption;
	department: DropdownOption;
	// center: DropdownOption;
	structureType: DropdownOption;
	canGrant: boolean;
}

export interface IUserProjectFormInputs extends IUserProjectForm {
	project: DropdownOption;
}

export interface IProjectUserFormInputs extends IUserProjectForm {
	user: DropdownOption;
}

// Honor
export interface IHonorFormInputs {
	employeeId: Id;
	name: string;
	rank: string;
	department: string;
	imageName: string;
	thumbnail: File;
}

// News
export interface INewsFormInputs {
	department: DropdownOption;
	title: string;
	shortSummary: string;
	imageName: string;
	newsType: DropdownOption;
	fullNews: string;
	thumbnail: File;
}

// Phone Directory
export interface IPhoneFormInputs {
	id: number;
	phone?: string;
	phone2?: string;
	phoneOffice?: string;
}
