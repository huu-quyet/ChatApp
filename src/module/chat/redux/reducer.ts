import { IUser, IRoom, IMessage } from "./../utils/types";
import { getAllRooms } from "./service";
import { createSlice, Dispatch } from "@reduxjs/toolkit";

export type TInitStateChats = {
	rooms: IRoom[];
	currentRoom: any;
	stageRoom: string;
	stageFriend: string;
	isCreatingRoom: boolean;
	searchedFriends: IUser[];
	usersSelected: IUser[];
	isLoading: boolean;
	mes: IMessage[];
	page: number;
	isLast: boolean;
	showPopup: boolean;
	countNewMes: number;
};

const initState: TInitStateChats = {
	mes: [],
	rooms: [],
	currentRoom: null,
	stageRoom: "",
	stageFriend: "",
	isCreatingRoom: false,
	searchedFriends: [],
	usersSelected: [],
	isLoading: true,
	page: 0,
	isLast: false,
	showPopup: false,
	countNewMes: 0,
};

const chatsReducer = createSlice({
	name: "chats",
	initialState: initState,
	reducers: {
		init(state) {
			state.mes = [];
			state.rooms = [];
			state.currentRoom = null;
			state.stageRoom = "";
			state.stageFriend = "";
			state.isCreatingRoom = false;
			state.searchedFriends = [];
			state.usersSelected = [];
			state.isLoading = true;
			state.page = 0;
			state.countNewMes = 0;
		},
		resetRoom(state) {
			state.mes = [];
			state.rooms = [];
			state.currentRoom = null;
			state.stageRoom = "";
			state.stageFriend = "";
			state.isCreatingRoom = false;
			state.searchedFriends = [];
			state.usersSelected = [];
			state.page = 0;
			state.isLast = false;
			state.countNewMes = 0;
		},
		fetchAllRooms(state, action) {
			state.rooms = action.payload.rooms;
			state.stageRoom = "SUCCESS";
		},
		fetchAllRoomsErr(state) {
			state.rooms = [];
			state.stageRoom = "ERROR";
		},
		setCurrentRoom(state, action) {
			localStorage.setItem(
				"currentRoom",
				JSON.stringify(action.payload.currentRoom)
			);
			state.currentRoom = action.payload.currentRoom;
			state.page = 0;
			state.countNewMes = 0;
		},
		updateCurrentRoom(state, action) {
			localStorage.setItem("currentRoom", JSON.stringify(action.payload));
			state.currentRoom = action.payload;
		},
		setIsCreatingRoom(state, action) {
			state.isCreatingRoom = action.payload;
			state.page = 0;
		},
		setSearchedFriends(state, action) {
			state.searchedFriends = action.payload.searchedFriends;
		},
		setUsersSelected(state, action) {
			state.usersSelected = action.payload.usersSelected;
		},
		setLoading(state, action) {
			state.isLoading = action.payload;
		},
		updateRoom(state, action) {
			state.rooms = action.payload;
		},
		getAllMes(state, action) {
			state.mes = action.payload;
		},
		updateMesInit(state) {
			state.mes = [];
			state.countNewMes = 0;
			state.page = 0;
			state.isLast = false;
		},
		updateMes(state, action) {
			state.mes = [...state.mes, action.payload];
			state.countNewMes = state.countNewMes + 1;
		},
		updatePage(state) {
			state.page = state.page + 1;
		},
		updateLoadMoreMes(state, action) {
			state.mes = [...action.payload.mes, ...state.mes];
			state.isLast = action.payload.isLast;
		},
		setShowPopup(state, action) {
			state.showPopup = action.payload;
		},
	},
});

export const fetchRooms = () => {
	return async (dispatch: Dispatch) => {
		dispatch(chatActions.setLoading(true));
		const fetchData = async () => {
			const res = await getAllRooms();
			if (res.data.status === "success") {
				return res.data.rooms;
			}

			return;
		};

		try {
			const rooms = await fetchData();
			let newCurrentRoom = {};
			const currentRoom = localStorage.getItem("currentRoom");
			if (currentRoom && currentRoom !== "{}") {
				if (rooms.find((room: any) => room?._id === JSON.parse(currentRoom)?._id)) {
					newCurrentRoom = JSON.parse(currentRoom);
				} else {
					newCurrentRoom = {};
				}
			} else {
				newCurrentRoom = rooms[0];
			}
			dispatch(chatActions.setLoading(false));
			dispatch(chatActions.fetchAllRooms({ rooms }));
			dispatch(chatActions.setCurrentRoom({ currentRoom: newCurrentRoom }));
		} catch (err) {
			dispatch(chatActions.setLoading(false));
			dispatch(chatActions.fetchAllRoomsErr());
		}
	};
};

export const chatActions = chatsReducer.actions;
export default chatsReducer.reducer;
