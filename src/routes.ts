import ChatPage from "./module/chat";
import LoginPage from "./module/login";
import ForgotPassword from "./module/login/components/ForgotPassword";
import ResetPassword from "./module/login/components/ResetPassword";

export const routes = [
	{
		path: "/login",
		component: LoginPage,
		header: false,
	},
	{
		path: "/forgot-password",
		component: ForgotPassword,
		header: false,
	},
	{
		path: "/reset-password/:resetToken",
		component: ResetPassword,
		header: false,
	},
	{
		path: "/message",
		component: ChatPage,
		header: true,
	},
];
