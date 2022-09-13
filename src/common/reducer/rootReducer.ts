import loginReducer from "../../module/login/redux/reducer";
import chatReducer from "../../module/chat/redux/reducer";
import friendsReducer from "../../module/friends/redux/reducer";

const rootReducer = {
	auth: loginReducer,
	chats: chatReducer,
	friends: friendsReducer,
};

export default rootReducer;
