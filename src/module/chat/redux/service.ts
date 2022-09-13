import { http } from "../../../common/service/axios";

export const getAllRooms = () => {
	return http().get("/room");
};

export const searchRooms = (body: { search: string }) => {
	return http().get(`/users/rooms/${body.search}`);
};

export const fetchSearchFriends = (body: { userName: string }) => {
	return http().get(`/users/searchFriends/${body.userName}`);
};

export const putChangeRoomInfo = ({
	roomId,
	body,
}: {
	roomId: string;
	body: any;
}) => {
	return http().put(`/room/${roomId}`, body);
};
