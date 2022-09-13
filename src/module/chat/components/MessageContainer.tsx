/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import socket, { EVENTS } from "../../../utils/socket";
import { chatActions } from "../redux/reducer";
import ButtonBackToBottom from "./ButtonBacktoBottom";
import ChatInput from "./ChatInput";
import ConversationSetting from "./ConversationSetting";
import Message from "./Message";

const MessageContainer = (): JSX.Element => {
	const {
		mes,
		page,
		currentRoom,
		isLast: isLastPage,
		showPopup: popupSetting,
	} = useSelector((state: RootState) => state.chats);
	const [isSendingMes, setIsSendingMes] = useState(false);
	const [isShowButton, setIsShowBottom] = useState(false);
	const [isScroll, setIsScroll] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const messageEndRef = useRef<any>(null);

	const dispatch = useDispatch();

	useEffect(() => {
		return () => {
			localStorage.removeItem("currentRoom");
			dispatch(chatActions.resetRoom());
			socket.emit(EVENTS.CLIENT.LEAVE_ROOM, currentRoom?._id);
		};
	}, []);

	useEffect(() => {
		setShowEmoji(false);
		setNewMessage("");
		dispatch(chatActions.setShowPopup(false));
	}, [currentRoom]);

	useEffect(() => {
		const mesEle = document.querySelector(".messages");
		const handleScrollLoadMoreMessage = () => {
			if (!mesEle) return;
			const scrollTotal = mesEle.scrollHeight - mesEle.clientHeight;
			if (mesEle.scrollTop / scrollTotal === 0 && !isLastPage) {
				setTimeout(() => {
					setIsScroll(true);
					dispatch(chatActions.updatePage());
				}, 100);
			} else {
				setIsScroll(false);
			}
			if (mesEle.scrollTop / scrollTotal < 0.8) {
				setIsShowBottom(true);
			} else {
				setIsShowBottom(false);
			}
		};
		mesEle?.addEventListener("scroll", handleScrollLoadMoreMessage);

		return () => {
			mesEle?.removeEventListener("scroll", handleScrollLoadMoreMessage);
		};
	}, [isLastPage]);

	useEffect(() => {
		if (page && !isLastPage && isScroll) {
			setIsScroll(false);
			socket.emit(
				EVENTS.CLIENT.LOAD_MORE_MESSAGE,
				{
					roomId: currentRoom?._id,
					page: page + 1,
					skip: page * 30,
				},
				(response: any) => {
					if (response.length > 0) {
						console.log(response);
						dispatch(
							chatActions.updateLoadMoreMes({
								mes: response,
								isLast: response?.length === 30 ? false : true,
							})
						);
						setIsSendingMes(false);
					}
				}
			);
		}
	}, [page, isLastPage, isScroll]);

	useEffect(() => {
		if (mes.length > 0 && page === 1) {
			// @ts-ignore
			setTimeout(() => {
				messageEndRef?.current?.scrollIntoView();
			}, 100);
		}
		if (isSendingMes) {
			// @ts-ignore
			messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
			setIsSendingMes(false);
		}
		if (!isSendingMes && page !== 1) {
			document.querySelector(".last_mess")?.scrollIntoView();
		}
	}, [mes, isSendingMes]);

	const handleBackToBottom = () => {
		const mesEle = document.querySelector(".messages");
		if (!mesEle) return;
		const scrollTotal = mesEle.scrollHeight - mesEle.clientHeight;
		mesEle?.scrollTo({ top: scrollTotal, behavior: "auto" });
	};

	return (
		<div className="h-[88%] w-full bg-gray-100 relative">
			{popupSetting ? <ConversationSetting /> : null}
			<div className="h-[90%] overflow-x-hidden overflow-y-auto messages">
				{mes.length > 0 && (
					<>
						{mes.map((m, i) => {
							return (
								<div className={`${i === 0 && "last_mess"} my-2`} key={m?._id}>
									<Message m={m} />
								</div>
							);
						})}
						<div ref={messageEndRef} />
					</>
				)}
			</div>
			{isShowButton ? (
				<ButtonBackToBottom handleBackToBottom={handleBackToBottom} />
			) : null}
			<ChatInput
				newMessage={newMessage}
				setNewMessage={setNewMessage}
				showEmoji={showEmoji}
				setShowEmoji={setShowEmoji}
				setIsSendingMes={setIsSendingMes}
			/>
		</div>
	);
};

export default MessageContainer;
