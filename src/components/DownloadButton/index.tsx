import React from "react";
import axios from "axios";

const DownloadButton = () => {
	const downloadFile = async () => {
		try {
			// Make a GET request to your API endpoint that returns the Excel file
			const response = await axios.get("your-api-endpoint", {
				responseType: "blob", // Important for binary responses (like files)
			});

			// Create a blob from the response data
			const blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});

			// Create a download link
			const downloadLink = document.createElement("a");
			downloadLink.href = window.URL.createObjectURL(blob);
			downloadLink.download = "example.xlsx"; // You can set the default file name

			// Trigger the download
			document.body.appendChild(downloadLink);
			downloadLink.click();

			// Clean up
			document.body.removeChild(downloadLink);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	return (
		<div>
			<button onClick={downloadFile}>Download Excel File</button>
		</div>
	);
};

export default DownloadButton;
