import React, { useEffect } from "react";
import loginImg from "../assets/login.svg";
import avatar from "../assets/avatar.png";
import Login from "../components/Login";
import { useDispatch } from "react-redux";
import { chatActions } from "../../chat/redux/reducer";

const LoginPage = (): JSX.Element => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(chatActions.init());
	}, []);
	return (
		<div className="h-full flex justify-center items-center">
			<div className="w-1/2 h-full bg-green-200 transition-all">
				<img className="w-full h-full" src={loginImg}></img>
			</div>
			<div className="w-1/2 h-full">
				<div className="w-full flex justify-center">
					<img className="w-16 h-16 my-4" src={avatar} />
				</div>
				<h2 className="w-full text-5xl font-black uppercase text-center">
					Welcome
				</h2>
				<Login />
			</div>
		</div>
	);
};

export default LoginPage;
