import { instance } from "../../../network";
import { APIExportData, APIResponse, getConfig } from "../..";
import { Id } from "../../../utils";

export async function exportAllocatedUsers(
	id: Id,
	exportParams: APIExportData,
	fileName: string
): Promise<APIResponse<BlobPart>> {
	try {
		const config = getConfig("application/json", "blob");

		const response = await instance.post<BlobPart>(
			`/projects/${id}/users/export`,
			exportParams,
			config
		);
		const data = response.data;

		// Create a blob from the response data
		const blob = new Blob([data], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});

		// Create a download link
		const downloadLink = document.createElement("a");
		downloadLink.href = window.URL.createObjectURL(blob);
		downloadLink.download = fileName; // You can set the default file name

		// Trigger the download
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// Clean up
		document.body.removeChild(downloadLink);

		return { data };
	} catch (error) {
		return { error };
	}
}
