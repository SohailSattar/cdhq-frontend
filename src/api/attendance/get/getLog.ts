import { APIResponse, getConfig } from '../..';
import { instance } from '../../../network';
import { APIAttendanceLogItem } from '../types';

export async function getAttendanceLog(): Promise<APIResponse<APIAttendanceLogItem[]>> {
	try {
		const config = getConfig();

		const url = `/attendance/log`;

		const response = await instance.get<APIAttendanceLogItem[]>(url, config);
		const data = response.data;
		return { data };
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}