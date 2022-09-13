import React, { useEffect } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import ListFriends from "../components/ListFriends";
import { fetchAllFriends } from "../redux/reducer";
import UserInfo from "../components/UserInfo";

const FriendsPage = (): JSX.Element => {
	const dispatch: Dispatch<any> = useDispatch();

	useEffect(() => {
		dispatch(fetchAllFriends());
	}, []);

	return (
		<main className="ml-24 flex">
			<ListFriends />
			<UserInfo />
		</main>
	);
};

export default FriendsPage;
