import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import socket, { EVENTS } from "../../../utils/socket";
import Header from "./Header";
import { chatActions } from "../redux/reducer";
import { updateRoom } from "../utils/function";
import MessageContainer from "./MessageContainer";

const ChatContainer = (): JSX.Element => {
	const { rooms, currentRoom, isLoading, isCreatingRoom } = useSelector(
		(state: RootState) => state.chats
	);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		const userInfo = localStorage.getItem("userInfo");
		if (currentRoom?._id && userInfo && !isLoading) {
			console.log(currentRoom);
			setLoading(true);
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
					setLoading(false);
				}
			);
		}

		return () => {
			socket.emit(EVENTS.CLIENT.LEAVE_ROOM, currentRoom?._id, socket.id);
		};
	}, [currentRoom?._id]);

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
			{currentRoom && (rooms?.length > 0 || isCreatingRoom) ? (
				<>
					<Header />
					<MessageContainer loading={loading} />
				</>
			) : (
				<div className="bg-gray-100 w-full h-full">
					<div className="component-center text-3xl text-center font-bold">
						Choose a chat to start
					</div>
				</div>
			)}
		</main>
	);
};

export default ChatContainer;
