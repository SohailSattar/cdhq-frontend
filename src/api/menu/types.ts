export interface APIMenuItem {
	id: number;
	name: string;
	nameEnglish: string;
	linkPath?: string;
	children: APIMenuItem[];
}
