/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import React, { useEffect } from "react";
import { PencilAltIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { IRoom } from "../utils/types";
import { RootState } from "../../../common/store/store";
import { chatActions } from "../redux/reducer";
import Avatar from "../../../common/components/Avatar";
import SearchRooms from "./SearchRooms";
import NewRoom from "./NewRoom";
import socket, { EVENTS } from "../../../utils/socket";
import { getDate, TYPE_MESSAGE } from "../utils/function";

const ListMessages = (): JSX.Element => {
	const { rooms, currentRoom, isCreatingRoom } = useSelector(
		(state: RootState) => state.chats
	);
	const { user } = useSelector((state: RootState) => state.auth);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (rooms.length === 0) return;

		const currentRoom = localStorage.getItem("currentRoom");

		if (currentRoom !== "undefined" && currentRoom) {
			const curRoom = JSON.parse(currentRoom);
			if (rooms?.find((room) => room?._id === curRoom?._id)) {
				navigate(`/messages/${curRoom?._id}`, { replace: true });
			}
		}
	}, [rooms]);

	const handleUpdateNewRoom = (newRoom: any, rooms: IRoom[]) => {
		const newRooms = [newRoom, ...rooms];
		dispatch(chatActions.updateRoom(newRooms));
	};

	useEffect(() => {
		socket.on(EVENTS.SERVER.NEW_ROOM, (newRoom) => {
			handleUpdateNewRoom(newRoom, rooms);
		});
		return () => {
			socket.off(EVENTS.SERVER.NEW_ROOM);
		};
	}, [rooms]);

	const socketJoinRoom = (room: IRoom) => {
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			socket.emit(
				EVENTS.CLIENT.JOIN_ROOM,
				currentRoom?._id,
				room._id,
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
	};

	const handleChooseRoom = (room: IRoom) => {
		if (currentRoom?._id === room?._id) {
			return;
		}
		dispatch(chatActions.setCurrentRoom({ currentRoom: room }));
		dispatch(chatActions.setIsCreatingRoom(false));
		dispatch(chatActions.setSearchedFriends({ searchedFriends: [] }));
		navigate(`/messages/${room?._id}`, { replace: true });

		socketJoinRoom(room);
	};

	const handleCreateNewRoom = () => {
		dispatch(chatActions.setCurrentRoom({ currentRoom: {} }));
		dispatch(chatActions.setIsCreatingRoom(true));
	};

	const handleCancelCreateRoom = () => {
		dispatch(chatActions.setCurrentRoom({ currentRoom: rooms[0] }));
		dispatch(chatActions.setIsCreatingRoom(false));
	};

	const checkUnReadNewMes = (unRead: string[] | undefined) => {
		let isUnRead = false;
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo && unRead) {
			const user = JSON.parse(userInfo);
			unRead.includes(user._id) ? (isUnRead = true) : (isUnRead = false);
		}

		return isUnRead;
	};

	const getRoomName = (room: IRoom) => {
		let roomName = "";

		if (room?.name?.length > 0) {
			roomName = room.name;
		} else {
			roomName = room?.userId
				?.reduce((acc: string, cur: any) => {
					let name = "";
					if (cur?._id === user?._id) {
						name = "";
					} else {
						name = cur?.userName + ", ";
					}
					return acc + name;
				}, "")
				.trim();
		}

		return roomName;
	};

	return (
		<section className="w-1/4 relative h-full overflow-hidden py-8">
			<div className="flex items-center justify-between px-4 mr-7">
				<h2 className="text-4xl font-black">Chats</h2>
				<PencilAltIcon
					onClick={handleCreateNewRoom}
					className="h-8 w-8 text-primary cursor-pointer"
				/>
			</div>
			<SearchRooms handleChooseRoom={handleChooseRoom} />
			<div className="my-8 w-full h-3/4 pr-8 overflow-x-hidden overflow-y-scroll scroll-smooth box-content">
				{isCreatingRoom && (
					<NewRoom handleCancelCreateRoom={handleCancelCreateRoom} />
				)}
				{rooms?.length > 0 ? (
					<>
						{[...rooms]
							.sort((a, b) => {
								return new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1;
							})
							.map((room: IRoom) => {
								return (
									<div
										key={room._id}
										className={`w-full px-2 py-2 flex items-center rounded-sm cursor-pointer relative ${
											currentRoom?._id === room?._id ? "bg-gray-100" : ""
										}`}
										onClick={() => {
											handleChooseRoom(room);
										}}
									>
										<span className="h-12 w-12 rounded-full bg-gray-300 mr-4 relative">
											<Avatar userId={room?.userId} />
										</span>
										<div className="w-[70%]">
											<span className="font-extrabold block whitespace-nowrap overflow-hidden text-ellipsis">
												{getRoomName(room)}
											</span>
											{room.lastMessage && (
												<span
													className={`w-full text-sm flex justify-between items-center ${
														checkUnReadNewMes(room?.unRead) && "font-bold"
													}`}
												>
													<span className="whitespace-nowrap overflow-hidden text-ellipsis mr-4">
														{room?.lastMessage?.type === TYPE_MESSAGE.TEXT &&
															room.lastMessage?.content}
														{room?.lastMessage?.type === TYPE_MESSAGE.IMG && "image"}
													</span>
													<span className="mr-2">
														{getDate(room.lastMessage?.receivedAt)}
													</span>
												</span>
											)}
											{checkUnReadNewMes(room?.unRead) && (
												<span className="w-3 h-3 flex absolute top-2 left-2">
													<span className="w-full h-full inline-flex bg-blue-500 rounded-full animate-ping absolute opacity-75"></span>
													<span className="relative inline-flex w-full h-full rounded-full bg-blue-500"></span>
												</span>
											)}
										</div>
									</div>
								);
							})}
					</>
				) : (
					<div className="w-[80%] h-full mt-[50%] text-center text-2xl font-bold">
						<div>Create chats to connect your friends</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default ListMessages;
