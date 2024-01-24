export async function logoutPhp() {
	try {
		const BASE_URL_PHP = process.env.REACT_APP_BASE_URL_PHP;

		const url = `${BASE_URL_PHP}cdhq/pmain/nh_logout.php`;
		var form = document.createElement("form");
		form.target = "_blank";
		form.method = "POST";
		form.action = url;

		document.body.appendChild(form);
		form.submit();
	} catch (err: any) {
		const error = err.response.data;
		return { error };
	}
}
