import { updateActiveStatus } from "./service";
// import { IUser } from "./../../chat/utils/types";
import { createSlice, Dispatch } from "@reduxjs/toolkit";

export type TInitStateAuth = {
	user: any;
};

const initState: TInitStateAuth = {
	user: {},
};

const loginReducer = createSlice({
	name: "auth",
	initialState: initState,
	reducers: {
		login(state, action) {
			state.user = action.payload;
		},

		logout() {
			return initState;
		},

		updateActiveStatus(state, action) {
			state.user = action.payload;
		},
	},
});

export const postUpdateActiveStatus = (params: any) => {
	return async (dispatch: Dispatch, getState: any) => {
		const postUpdate = async () => {
			const res = await updateActiveStatus(params);
			if (res.data.status === "success") {
				return res.data.user;
			}

			return;
		};

		try {
			let newUser = {};
			const user = await postUpdate();
			if (user) {
				newUser = user;
			} else {
				newUser = getState().auth.user;
			}
			localStorage.setItem("userInfo", JSON.stringify(newUser));
			dispatch(loginActions.updateActiveStatus(newUser));
		} catch (err) {
			console.log("error");
		}
	};
};

export const loginActions = loginReducer.actions;
export default loginReducer.reducer;
