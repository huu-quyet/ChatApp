import { IUser } from "./../../chat/utils/types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { getAllFriends } from "./service";

type TInitState = {
	friends: IUser[];
	userSelected: any;
	stageFriend: string;
	loading: boolean;
};

const initState: TInitState = {
	friends: [],
	userSelected: "",
	stageFriend: "",
	loading: false,
};

const friendsReducer = createSlice({
	name: "friends",
	initialState: initState,
	reducers: {
		initState(state) {
			state.friends = [];
			state.userSelected = "";
			state.stageFriend = "";
			state.loading = false;
		},
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
		setLoading(state, action) {
			state.loading = action.payload;
		},
	},
});

export const fetchAllFriends = () => {
	return async (dispatch: Dispatch) => {
		const fetchData = async () => {
			const res = await getAllFriends();
			if (res.data.status === "success") {
				dispatch(friendsAction.setLoading(false));
				return res.data.data;
			}
			dispatch(friendsAction.setLoading(false));
			return;
		};

		try {
			dispatch(friendsAction.setLoading(true));
			const friends = await fetchData();
			dispatch(friendsAction.fetchAllFriends({ friends }));
		} catch (err) {
			dispatch(friendsAction.fetchAllFriendsErr());
		}
	};
};

export const friendsAction = friendsReducer.actions;
export default friendsReducer.reducer;
