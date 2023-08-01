export interface APIMenuListItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
	children: APIMenuListItem[];
}

export interface APIMenuItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
}

export interface APIMenuItemDetail {
	id: number;
	name: string;
	nameEnglish: string;
	parent: APIMenuItem;
	linkPath?: string;
	isVisible: boolean;
}
