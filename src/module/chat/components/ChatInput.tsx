/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import lodash from "lodash";
import { PaperAirplaneIcon, PhotographIcon } from "@heroicons/react/outline";

import { TYPE_MESSAGE, updateRoom } from "../utils/function";
import { RootState } from "../../../common/store/store";
import socket, { EVENTS } from "../../../utils/socket";
import { chatActions } from "../redux/reducer";
import { IMessage } from "../utils/types";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/huuquyet/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "huuquyet";

type TProps = {
	setIsSendingMes: any;
	newMessage: string;
	setNewMessage: any;
	showEmoji: boolean;
	setShowEmoji: any;
};

const ChatInput = ({
	setIsSendingMes,
	newMessage,
	setNewMessage,
	showEmoji,
	setShowEmoji,
}: TProps) => {
	const { user } = useSelector((state: RootState) => state.auth);
	const { rooms, currentRoom } = useSelector((state: RootState) => state.chats);

	const dispatch = useDispatch();

	const handleChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewMessage(e.target.value);
		if (showEmoji) {
			setShowEmoji(false);
		}
	};

	const socketSendMes = (newMes: any) => {
		socket.emit(
			EVENTS.CLIENT.SEND_MESSAGE,
			newMes,
			(response: { room: any; newMessInfo: IMessage }) => {
				updateRoom(rooms, response.room, dispatch);
				dispatch(chatActions.updateMes(response.newMessInfo));
			}
		);
	};

	const sendMes = () => {
		setShowEmoji(false);
		setNewMessage("");
		setIsSendingMes(true);
		if (newMessage.length > 0) {
			const newMes = {
				content: newMessage,
				type: TYPE_MESSAGE.TEXT,
				path: null,
				sender: user._id,
				sendedAt: new Date(Date.now()),
				receiver: currentRoom._id,
			};

			socketSendMes(newMes);
		}
	};

	const handleSendMessage = lodash.debounce(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.code === "Enter") {
				sendMes();
			}
		},
		100
	);

	const handleSendMessageImg = (path: string) => {
		setNewMessage("");
		setIsSendingMes(true);
		if (path.length > 0) {
			const newMes = {
				content: "",
				type: TYPE_MESSAGE.IMG,
				path: path,
				sender: user.id,
				sendedAt: new Date(Date.now()),
				receiver: currentRoom._id,
			};

			socketSendMes(newMes);
		}
	};

	const handleSendMesFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length !== 0 && e.target.files) {
			const file = e.target.files[0];
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
			const res = await axios.post(CLOUDINARY_URL, formData);
			if (res.data.secure_url) {
				handleSendMessageImg(res.data.secure_url);
			}
		}
	};

	const handleShowEmoji = useCallback(() => {
		setShowEmoji(!showEmoji);
	}, [showEmoji]);

	const handleEmojiClick = (event: any, emoji: any) => {
		let message = newMessage;
		message += emoji.emoji;
		setNewMessage(message);
	};

	const closeEmojiContainer = useCallback(() => {
		setShowEmoji(false);
	}, []);

	return (
		<>
			<div className="w-full relative h-[10%] bg-gray-200 flex items-center">
				<div className="w-full h-10 flex justify-center items-center relative">
					<span className="relative">
						<PhotographIcon className="w-8 h-8 text-primary mr-4 hover:bg-gray-200 hover:rounded-full cursor-pointer"></PhotographIcon>
						<input
							type="file"
							className="w-8 h-8 absolute top-0 left-0 opacity-0"
							onChange={(e) => {
								setShowEmoji(false);
								handleSendMesFile(e);
							}}
						/>
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-8 h-8 text-primary mr-4"
						onClick={handleShowEmoji}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
						/>
					</svg>

					<input
						value={newMessage}
						onKeyDown={(e) => handleSendMessage(e)}
						onChange={(e) => handleChangeMessage(e)}
						onFocus={() => {
							setShowEmoji(false);
						}}
						className="h-10 rounded-xl px-4 w-4/5 focus:outline-none focus:border-none"
						type="text"
						placeholder="Enter text"
					/>
					<span>
						<PaperAirplaneIcon
							onClick={sendMes}
							className="w-8 h-8 rotate-90 ml-4 text-primary"
						/>
					</span>
				</div>
			</div>
			{showEmoji ? (
				<>
					<div
						onClick={closeEmojiContainer}
						className="w-full h-[-90%] z-10 absolute top-0 left-0 bottom-[10%] bg-opacity-0 bg-white"
					></div>
					<EmojiPicker onEmojiClick={handleEmojiClick} />
				</>
			) : null}
		</>
	);
};

export default React.memo(ChatInput);
