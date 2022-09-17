import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.scss";
import Header from "./common/components/Header";
import ChatPage from "./module/chat";
import FriendsPage from "./module/friends";
import LoginPage from "./module/login";
import ForgotPassword from "./module/login/components/ForgotPassword";
import ResetPassword from "./module/login/components/ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "./module/login/redux/reducer";
import { fnSocket } from "./utils/socket";
import { RootState } from "./common/store/store";
import { getUserInfo } from "./module/friends/redux/service";

let is_first = false;

function App() {
	const { user } = useSelector((state: RootState) => state.auth);
	const [href, setHref] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		setHref(window.location.href);
	}, [window.location.href]);

	useEffect(() => {
		const expireTime = localStorage.getItem("expireTime");
		if (!expireTime) {
			navigate("/login", { replace: true });
		}
		if (expireTime) {
			const availableTime = +new Date(JSON.parse(expireTime));
			const now = Date.now();
			if (now > availableTime) {
				navigate("/login", { replace: true });
			}
		}

		return () => {
			localStorage.removeItem("currentRoom");
		};
	}, []);

	useEffect(() => {
		const userInfo = localStorage.getItem("userInfo");
		const token = localStorage.getItem("token");

		if (
			(!token || !userInfo) &&
			!window.location.pathname.includes("reset-password")
		) {
			navigate("/login", { replace: true });
		}
		if (token && userInfo) {
			dispatch(loginActions.login(JSON.parse(userInfo)));
		}
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			getUserInfo().then((data) => {
				if (data.data.status === "success") {
					localStorage.setItem("userInfo", JSON.stringify(data.data.user));
					dispatch(loginActions.updateActiveStatus(data.data.user));
				}
			});
		}
	}, []);

	useEffect(() => {
		if (!is_first && user?._id) {
			is_first = true;
			fnSocket(dispatch, user);
		}
	}, [user]);

	return (
		<div className="w-screen h-screen overflow-hidden relative">
			<Header href={href} />
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password/:resetToken" element={<ResetPassword />} />
				<Route
					path="/messages"
					element={
						<div className="relative w-screen h-screen">
							<ChatPage />
						</div>
					}
				/>
				<Route
					path="/messages/:id"
					element={
						<div className="relative w-screen h-screen">
							<ChatPage />
						</div>
					}
				/>
				<Route
					path="/friends"
					element={
						<div className="relative w-screen h-screen">
							<FriendsPage />
						</div>
					}
				/>
				<Route
					path="/friends/:id"
					element={
						<div className="relative w-screen h-screen">
							<FriendsPage />
						</div>
					}
				/>
				<Route
					path="/calendar"
					element={
						<div className="relative w-screen h-screen">
							<div className="font-black text-7xl component-center">Coming soon</div>
						</div>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;
