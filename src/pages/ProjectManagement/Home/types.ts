import { APIProjectGroup } from '../../../api/projects/types';

export interface ProjectTable {
	id: number;
	name: string;
	nameEnglish: string;
	nameArabic: string;
	group: APIProjectGroup;
}
