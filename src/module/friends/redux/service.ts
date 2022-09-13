import { http } from "../../../common/service/axios";

export const getAllFriends = () => {
	return http().get("/users/friends");
};

export const searchUserByUserName = (params: string) => {
	return http().get(`/users/searchUser/${params}`);
};

export const unfriend = (id: string) => {
	return http().put(`users/unfriend/${id}`);
};

export const addFriend = (id: string) => {
	return http().put(`users/addFriend/${id}`);
};

export const rejectAddFriend = (id: string) => {
	return http().put(`users/reject/${id}`);
};

export const sendRequireAddFriend = (id: string) => {
	return http().put(`users/sendRequire/${id}`);
};

export const getUserInfo = () => {
	return http().get("users/info");
};

export const getUserInfoById = (id: string) => {
	return http().get(`users/${id}`);
};

export const getListUserInfoNotify = () => {
	return http().get("users/notify");
};
