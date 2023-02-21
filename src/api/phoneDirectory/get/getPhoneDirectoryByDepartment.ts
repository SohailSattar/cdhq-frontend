import { APIResponse, getConfig } from "../..";
import { instance } from "../../../network";
import { APIPagedPhoneDirectory, APIPhoneDirectory } from "../types";

export async function getPhoneDirectoryByDepartment(
  id: number,
  currentPage: number = 1,
  pageSize: number = 50
): Promise<APIResponse<APIPagedPhoneDirectory>> {
  try {
    const config = getConfig();

    const response = await instance.get<APIPagedPhoneDirectory>(
      `/phone-directory/${id}?page=${currentPage}&postsperpage=${pageSize}`,
      config
    );
    const data = response.data;
    return { data };
  } catch (err: any) {
    const error = err.response.data;
    return { error };
  }
}
