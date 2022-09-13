import { IUser } from "./../../chat/utils/types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { getAllFriends } from "./service";

type TInitState = {
	friends: IUser[];
	userSelected: any;
	stageFriend: string;
};

const initState: TInitState = {
	friends: [],
	userSelected: "",
	stageFriend: "",
};

const friendsReducer = createSlice({
	name: "friends",
	initialState: initState,
	reducers: {
		fetchAllFriends(state, action) {
			state.friends = action.payload.friends;
			state.stageFriend = "SUCCESS";
		},
		fetchAllFriendsErr(state) {
			state.friends = [];
			state.stageFriend = "";
		},
		setSelectedUser(state, action) {
			state.userSelected = action.payload.userId;
		},
	},
});

export const fetchAllFriends = () => {
	return async (dispatch: Dispatch) => {
		const fetchData = async () => {
			const res = await getAllFriends();
			if (res.data.status === "success") {
				return res.data.data;
			}

			return;
		};

		try {
			const friends = await fetchData();
			dispatch(friendsAction.fetchAllFriends({ friends }));
		} catch (err) {
			dispatch(friendsAction.fetchAllFriendsErr());
		}
	};
};

export const friendsAction = friendsReducer.actions;
export default friendsReducer.reducer;
