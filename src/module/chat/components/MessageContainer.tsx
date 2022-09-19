/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../common/store/store";
import socket, { EVENTS } from "../../../utils/socket";
import { chatActions } from "../redux/reducer";
import ButtonBackToBottom from "./ButtonBacktoBottom";
import ChatInput from "./ChatInput";
import CircleLoading from "./CircleLoading";
import ConversationSetting from "./ConversationSetting";
import Message from "./Message";

const MessageContainer = ({ loading }: { loading: boolean }): JSX.Element => {
	const {
		mes,
		page,
		currentRoom,
		isLast: isLastPage,
		showPopup: popupSetting,
		countNewMes,
	} = useSelector((state: RootState) => state.chats);

	const [isSendingMes, setIsSendingMes] = useState(false);
	const [isShowButton, setIsShowButton] = useState(false);
	const [isScroll, setIsScroll] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const [isLoadMore, setIsLoadMore] = useState(false);

	const messageEndRef = useRef<any>(null);

	const dispatch = useDispatch();

	useEffect(() => {
		return () => {
			localStorage.removeItem("currentRoom");
			dispatch(chatActions.resetRoom());
			setIsShowButton(false);
			socket.emit(EVENTS.CLIENT.LEAVE_ROOM, currentRoom?._id);
		};
	}, []);

	useEffect(() => {
		setShowEmoji(false);
		setNewMessage("");
		setIsShowButton(false);
		dispatch(chatActions.setShowPopup(false));
	}, [currentRoom]);

	useEffect(() => {
		if (loading) return;

		const mesEle = document.querySelector(".messages");

		const handleScrollLoadMoreMessage = () => {
			if (!mesEle) return;
			const scrollTotal = mesEle.scrollHeight - mesEle.clientHeight;
			if (mesEle.scrollTop / scrollTotal === 0 && !isLastPage) {
				setTimeout(() => {
					setIsScroll(true);
					setIsLoadMore(true);
					dispatch(chatActions.updatePage());
				}, 100);
			} else {
				setIsScroll(false);
				setIsLoadMore(false);
			}
			if (mesEle.scrollTop / scrollTotal < 0.8) {
				setIsShowButton(true);
			} else {
				setIsShowButton(false);
			}
		};

		mesEle?.addEventListener("scroll", handleScrollLoadMoreMessage);

		return () => {
			mesEle?.removeEventListener("scroll", handleScrollLoadMoreMessage);
		};
	}, [isLastPage, loading]);

	useEffect(() => {
		if (page && !isLastPage && isScroll) {
			setIsScroll(false);

			socket.emit(
				EVENTS.CLIENT.LOAD_MORE_MESSAGE,
				{
					roomId: currentRoom?._id,
					page: page + 1,
					skip: page * 30 + countNewMes,
				},
				(response: any) => {
					if (response.length > 0) {
						dispatch(
							chatActions.updateLoadMoreMes({
								mes: response,
								isLast: response?.length === 30 ? false : true,
							})
						);
						setIsLoadMore(false);
						setIsSendingMes(false);
					}
					setIsLoadMore(false);
				}
			);
		}
	}, [page, isLastPage, isScroll]);

	useEffect(() => {
		if (loading) return;

		if (mes.length > 0 && page === 0) {
			// @ts-ignore
			setTimeout(() => {
				messageEndRef?.current?.scrollIntoView({ behavior: "auto" });
			}, 100);
		}
		if (isSendingMes) {
			// @ts-ignore
			messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
			setIsSendingMes(false);
		}
		if (!isSendingMes && page !== 0) {
			document.querySelector(".last_mess")?.scrollIntoView();
		}
	}, [mes, loading]);

	const handleBackToBottom = () => {
		const mesEle = document.querySelector(".messages");
		if (!mesEle) return;
		const scrollTotal = mesEle.scrollHeight - mesEle.clientHeight;
		mesEle?.scrollTo({ top: scrollTotal, behavior: "auto" });
	};

	return (
		<section className="h-[88%] w-full bg-gray-100 relative">
			{currentRoom?._id ? (
				<>
					{popupSetting ? <ConversationSetting /> : null}
					{loading ? (
						<CircleLoading />
					) : (
						<div className="h-[90%] w-full overflow-x-hidden overflow-y-auto messages">
							{isLoadMore ? (
								<div className="w-full h-6 flex justify-center">
									<span className="w-6 h-6 border-2 rounded-full border-l-transparent border-primary animate-spin mt-4 inline-block" />
								</div>
							) : null}
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
					)}
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
				</>
			) : null}
		</section>
	);
};

export default MessageContainer;
