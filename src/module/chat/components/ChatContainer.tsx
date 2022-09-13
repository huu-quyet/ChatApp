import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import MessageContainer from "./MessageContainer";
import socket, { EVENTS } from "../../../utils/socket";
import Header from "./Header";
import { chatActions } from "../redux/reducer";
import { updateRoom } from "../utils/function";

let is_first = true;

const ChatContainer = (): JSX.Element => {
	const { rooms, currentRoom, isLoading } = useSelector(
		(state: RootState) => state.chats
	);

	const dispatch = useDispatch();

	useEffect(() => {
		const userInfo = localStorage.getItem("userInfo");
		if (currentRoom?._id && userInfo && !isLoading && is_first) {
			is_first = false;
			socket.emit(
				EVENTS.CLIENT.JOIN_ROOM,
				null,
				currentRoom?._id,
				socket.id,
				JSON.parse(userInfo)._id,
				(response: any) => {
					const roomExist = rooms.findIndex(
						(room) => room._id === response.room._id
					);
					const newRooms = [...rooms];
					newRooms[roomExist] = {
						...rooms[roomExist],
						unRead: response.room.unRead,
					};
					dispatch(chatActions.getAllMes(response.messages));
					dispatch(chatActions.updateRoom(newRooms));
				}
			);
		}
	}, [currentRoom?._id, isLoading]);

	const handleUpdateRoomMessage = (room: any, newMes: any, currentRoom: any) => {
		if (currentRoom?._id === newMes?.receiver) {
			dispatch(chatActions.updateMes(newMes));
		}
		updateRoom(rooms, room, dispatch);
	};

	useEffect(() => {
		if (currentRoom?._id) {
			socket.on(EVENTS.SERVER.ROOM_MESSAGE, (room, newMes) => {
				handleUpdateRoomMessage(room, newMes, currentRoom);
			});
		}

		return () => {
			socket.off(EVENTS.SERVER.ROOM_MESSAGE);
		};
	}, [currentRoom?._id]);

	return (
		<main className="flex-grow -ml-8 w-3/4 h-screen border-l relative">
			{currentRoom ? (
				<>
					<Header />
					<MessageContainer />
				</>
			) : (
				<div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-2xl font-bold">
					{/* Choose a room to start the conversation */}
				</div>
			)}
		</main>
	);
};

export default ChatContainer;
