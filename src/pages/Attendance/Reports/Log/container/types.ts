import { DropdownOption } from "../../../../../components/Dropdown";

export interface ISearchFields{
    dateFrom: Date,
	dateTo: Date,
	workMode: DropdownOption,
	employeeCategory: DropdownOption,
	department: DropdownOption
}