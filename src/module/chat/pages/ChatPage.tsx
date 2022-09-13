import React, { useEffect } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer";
import ListMessages from "../components/ListMessages";
import { fetchRooms } from "../redux/reducer";
import { RootState } from "../../../common/store/store";
import Loading from "../../../common/components/Loading";

const ChatPage = (): JSX.Element => {
	const { isLoading } = useSelector((state: RootState) => state.chats);
	const dispatch: Dispatch<any> = useDispatch();

	useEffect(() => {
		dispatch(fetchRooms());
	}, []);

	return (
		<main className="flex ml-24">
			{!isLoading && (
				<>
					<ListMessages />
					<ChatContainer />
				</>
			)}
			{isLoading && <Loading />}
		</main>
	);
};

export default ChatPage;
