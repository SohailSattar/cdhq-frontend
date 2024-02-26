import { Id } from "../../utils";
import { APIActiveStatus } from "../activeStatus/types";
import { APICivilDefenseBuildingOwner } from "../civilDefenseBuildingsOwners/types";
import { APICategorizedDepartment } from "../departments/types";
import { APIBase, APIPaginate, APIStatus } from "../types";

export interface APICivilDefenseBuilding extends APIBase {}

export interface APICivilDefenseBuildingItem extends APICivilDefenseBuilding {
	activeStatus: APIActiveStatus;
	owner: APICivilDefenseBuildingOwner;
}

export interface APICivilDefenseBuildingDetail extends APICivilDefenseBuilding {
	constructionYear: string;
	latitude: string;
	longitude: string;
	activeStatus: APIActiveStatus;
	owner: APICivilDefenseBuildingOwner;
	section: APICategorizedDepartment;
	createdBy: string;
	createdOn: string;
	updatedBy: string;
	updatedOn: string;
}

export interface APIPaginatedCivilDefenseBuilding extends APIPaginate {
	buildings: APICivilDefenseBuildingItem[];
}

export interface APICreateCivilDefenseBuilding {
	name: string;
	nameEnglish: string;
	ownerId: Id;
	constructionYear?: string;
	latitude?: number;
	longitude?: number;
	sectionId: Id;
}
export interface APIUpdateCivilDefenseBuilding {
	id: Id;
	name: string;
	nameEnglish: string;
	ownerId: Id;
	constructionYear?: string;
	latitude?: number;
	longitude?: number;
	sectionId: Id;
}

export interface APIUpdateCivilDefenseBuildingStatus extends APIStatus {}
