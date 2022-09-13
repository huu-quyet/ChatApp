import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:8000/api/v1/";

export const http = () => {
	const tokenStorage = localStorage.getItem("token");
	let token = "";
	if (tokenStorage) {
		token = JSON.parse(tokenStorage);
	}
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bear ${token}`,
		},
	});
};
