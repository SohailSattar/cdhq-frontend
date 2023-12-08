import { v4 as uuidv4 } from "uuid";
import { instance } from "../../../network";
import { APINewSession } from "../types";

export async function generateSessionToken() {
	try {
		let token = localStorage.getItem("sessionToken") || uuidv4();
		localStorage.setItem("sessionToken", token);

		const session = await instance.post<APINewSession>("/sessions/", {
			sessionToken: token,
		});

		instance.defaults.headers.common["CurrentSession"] =
			session.data.sessionToken || "";
	} catch (error) {
		return { error };
	}
}
