import { Dispatch } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { loginActions } from "../module/login/redux/reducer";

// const SOCKET_URL = "https://chat-app-quyetnh.herokuapp.com/";
const SOCKET_URL = "http://localhost:8000/";

export const EVENTS = {
	connection: "connection",
	CLIENT: {
		USER_CONNECTION: "USER_CONNECTION",
		CREATE_ROOM: "CREATE_ROOM",
		SEND_MESSAGE: "SEND_MESSAGE",
		JOIN_ROOM: "JOIN_ROOM",
		SEND_REQUIRE: "SEND_REQUIRE",
		WAITING_APPROVAL: "WAITING_APPROVAL",
		LOAD_MORE_MESSAGE: "LOAD_MORE_MESSAGE",
		LEAVE_ROOM: "LEAVE_ROOM",
		UPDATE_ROOM: "UPDATE_ROOM",
	},
	SERVER: {
		ROOMS: "ROOMS",
		NEW_ROOM: "NEW_ROOM",
		JOINED_ROOM: "JOINED_ROOM",
		ROOM_MESSAGE: "ROOM_MESSAGE",
		SEND_REQUIRE: "SEND_REQUIRE",
		WAITING_APPROVAL: "WAITING_APPROVAL",
		NEW_REQUIRE_ADD_FRIEND: "NEW_REQUIRE_ADD_FRIEND",
		UPDATE_ROOM: "UPDATE_ROOM",
	},
};

const socket = io(SOCKET_URL);

export const fnSocket = (dispatch: Dispatch, user: any) => {
	socket.on("connect", () => {
		console.log("User connected");
		console.log(socket.connected);
		console.log(socket.id);

		// Send user is online
		socket.emit(EVENTS.CLIENT.USER_CONNECTION, user?._id, socket.id);
	});

	socket.on("disconnect", (reason) => {
		if (reason === "io server disconnect") {
			// the disconnection was initiated by the server, you need to reconnect manually
			socket.connect();
		}
		// else the socket will automatically try to reconnect
	});

	socket.on(EVENTS.SERVER.NEW_REQUIRE_ADD_FRIEND, (response) => {
		if (user?._id === response.receiver) {
			dispatch(loginActions.updateActiveStatus(response.receiverInfo));
		}
	});
	return () => {
		socket.off("disconnect", () => {
			console.log("User disconnected");
		});
	};
};

export default socket;
