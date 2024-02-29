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

//////////////// CONTENT MANAGEMENT ////////////////

export interface ILinkTypeFormInputs {
	name: string;
	nameEnglish: string;
	isFile: boolean;
}

export interface IMenuFormInputs {
	name: string;
	nameEnglish: string;
	parentProject?: DropdownOption;
	menuType: DropdownOption;
	linkType: DropdownOption;
	file?: File;
	linkPath: string;
	isVisible?: boolean;
	orderNo: string;
	isExternalLink?: boolean;
}

// Image
export interface IImageFormInputs {
	name: string;
	nameEnglish: string;
	imageName: string;
	thumbnail: File;
	videoName: string;
	videoFile: File;
	imageType: DropdownOption;
	stars?: string;
}

// QR Code
export interface IQRCodeFormInputs {
	name: string;
	nameEnglish: string;
	image: File;
	imageName: string;
	icon: File;
	iconName: string;
}

// Request Forms
export interface IRequestFormInputs {
	name: string;
	nameEnglish: string;
	formFile: File;
	formName: string;
	isExternalPath: boolean;
	// icon: File;
	// iconName: string;
}

// Civil Defense Building Forms
export interface ICivilDefenseBuildingFormInputs {
	name: string;
	nameEnglish: string;
	owner: DropdownOption;
	constructionYear: string;
	latitude: string;
	longitude: string;
	section: DropdownOption;
}

////////////////////////////////////////////////////////////////////////////////

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

export interface IDepartmentFormInputs {
	name: string;
	nameEnglish: string;
	level: DropdownOption;
	parent: DropdownOption;
	emirate: DropdownOption;
	status: DropdownOption;
	operator: DropdownOption;
	group: DropdownOption;
	cdBuilding: DropdownOption;
	moiDeptId?: string;
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
	canExportExcel: boolean;
	canExportPdf: boolean;
}

export interface IUserProjectFormInputs extends IUserProjectForm {
	project: DropdownOption;
}

export interface IProjectUserFormInputs extends IUserProjectForm {
	user: DropdownOption;
}

// Honor
export interface IHonorFormInputs {
	honorType: DropdownOption;
	employeeId: Id;
	name: string;
	rank: string;
	department: string;
	imageName: string;
	thumbnail: File;
	notes: string;
}

// News
export interface INewsFormInputs {
	department: DropdownOption;
	title: string;
	shortSummary: string;
	imageName: string;
	videoName: string;
	newsType: DropdownOption;
	fullNews: string;
	thumbnail: File;
	video: File;
}

// Phone Directory
export interface IPhoneFormInputs {
	id: number;
	phone?: string;
	phone2?: string;
	phoneOffice?: string;
}
