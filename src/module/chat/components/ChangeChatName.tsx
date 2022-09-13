import React, { useState } from "react";
import lodash from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import { chatActions } from "../redux/reducer";
import socket, { EVENTS } from "../../../utils/socket";

type TProps = {
	setChangeChatName: any;
};

const ChangeChatName = ({ setChangeChatName }: TProps): JSX.Element => {
	const { currentRoom, rooms } = useSelector((state: RootState) => state.chats);
	const [isLoading, setIsLoading] = useState(false);
	const [chatName, setChatName] = useState("");

	const dispatch = useDispatch();

	const onChangeRoomName = (text: string) => {
		setChatName(text.trim());
	};
	const handleChangeRoomName = lodash.debounce(() => {
		setIsLoading(true);
		if (currentRoom?.name !== chatName && chatName.length > 0) {
			socket.emit(
				EVENTS.CLIENT.UPDATE_ROOM,
				currentRoom?._id,
				{ name: chatName },
				() => {
					const newRoom = { ...currentRoom, name: chatName };
					const newRooms = [...rooms];
					const curRoomIndex = newRooms.findIndex(
						(room) => room?._id === newRoom?._id
					);
					if (curRoomIndex !== -1) {
						newRooms[curRoomIndex] = newRoom;
						dispatch(chatActions.updateRoom(newRooms));
						dispatch(chatActions.updateCurrentRoom(newRoom));
					}
					setIsLoading(false);
				}
			);
		}
	}, 300);
	return (
		<div className="w-full h-full absolute top-0 left-0">
			<div className="absolute top-0 left-0 w-full h-full bg-gray-300 bg-opacity-90 z-[11]"></div>
			<div className="component-center w-1/3 h-1/3 flex flex-col bg-primary rounded-lg shadow-xl z-[12]">
				<h2 className="text-center my-4 font-black text-2xl">
					Change your group chat name
				</h2>
				<div className="relative">
					<input
						className="w-3/4 mx-auto my-2 px-2 py-2 rounded-lg focus:outline-none focus:border-none block"
						placeholder="Chat name..."
						onChange={(e) => {
							onChangeRoomName(e.target.value);
						}}
					/>
					<div className="w-3/4 mx-auto flex justify-between items-center">
						<button
							className="flex items-center justify-center py-1 border-2 font-bold w-[40%] rounded-lg hover:bg-secondary hover:outline-none active:outline-none"
							onClick={handleChangeRoomName}
						>
							{!isLoading ? <span>Change</span> : null}
							{isLoading ? (
								<span className="w-5 h-5 mx-3 animate-spin border-4 rounded-t-full rounded-b-full border-l-transparent inline-block"></span>
							) : null}
						</button>
						<button
							className="border-2 font-bold py-1 w-[40%] rounded-lg hover:bg-secondary hover:outline-none active:outline-none"
							onClick={() => {
								setChangeChatName(false);
							}}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChangeChatName;
