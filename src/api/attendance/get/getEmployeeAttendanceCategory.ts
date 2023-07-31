import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIEmployeeAttendanceCategory } from '../types';

export async function getEmployeeAttendanceCategory(): Promise<APIResponse<APIEmployeeAttendanceCategory[]>> {
	try {
		const config = getConfig();

		const url = `/attendance/employee-attendance-category`;

		const response = await instance.get<APIEmployeeAttendanceCategory[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}