import { http } from "../../../common/service/axios";
import { IDataLogin, IDataSignup } from "../utils/type";

export const apiLogin = (data: IDataLogin) => {
	return http().post("users/login", data);
};

export const apiSignUp = (data: IDataSignup) => {
	return http().post("users/signup", data);
};

export const forgotPassword = (data: { email: string }) => {
	return http().post("users/forgotPassword", data);
};

export const resetPassword = (
	params: string,
	data: { password: string; confirmPassword: string }
) => {
	return http().post(`/users/resetPassword/${params}`, data);
};

export const updateActiveStatus = (params: any) => {
	return http().post("users/update/activeStatus", params);
};

export const changePassword = (params: any) => {
	return http().post("users/updatePassword", params);
};

export const updateUserInfo = (params: {
	userName?: string;
	avatar?: string;
}) => {
	return http().post("users/updateUserInfo", params);
};
