import React, { useEffect, useState } from "react";
import "../assets/css/Login.scss";
import { apiLogin, apiSignUp } from "../redux/service";
import {
	MailIcon,
	KeyIcon,
	UserIcon,
	EyeOffIcon,
	EyeIcon,
} from "@heroicons/react/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginActions } from "../redux/reducer";

const Login = (): JSX.Element => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loginError, setLoginError] = useState("");
	const [typePassword, setTypePassword] = useState("password");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const token = localStorage.getItem("token");
	const userInfo = localStorage.getItem("userInfo");
	useEffect(() => {
		if (!token || !userInfo) {
			navigate("/login", { replace: true });
		}
		if (token && userInfo) {
			dispatch(loginActions.login(JSON.parse(userInfo)));
			navigate("/messages", { replace: true });
		}
	}, [token, userInfo]);

	useEffect(() => {
		setEmail("");
		setPassword("");
		setUserName("");
		setConfirmPassword("");
		setLoginError("");
	}, [isLogin]);

	const handleChecked = () => {
		setIsLogin(!isLogin);
	};

	const handleChangeInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		setState: React.SetStateAction<any>
	) => {
		setState(e.target.value);
	};

	const login = (e: any) => {
		if (e.type === "click" || (e.type === "keydown" && e.code === "Enter")) {
			if (!email) {
				setLoginError("Please enter an email");
				return;
			}
			if (email && !email.includes("@")) {
				setLoginError("Email not correct");
				return;
			}
			if (password && password?.length < 8) {
				setLoginError("Password have at last 8 characters");
				return;
			}
			if (!password) {
				setLoginError("Please enter a password");
				return;
			}
			if (email && password && email.includes("@") && password.length >= 8) {
				const data = {
					email,
					password,
				};
				apiLogin(data)
					.then((data) => {
						setLoginError("");
						localStorage.setItem("userInfo", JSON.stringify(data.data.data));
						localStorage.setItem("expireTime", JSON.stringify(data.data.expireTime));
						localStorage.setItem("token", JSON.stringify(data.data.token));
						dispatch(loginActions.login(data.data.data));
						navigate("/messages", { replace: true });
					})
					.catch((error) => {
						if (error.response.data.message) {
							setLoginError(error.response.data.message);
							return;
						}

						setLoginError("Something went wrong!!!");
					});
			}
		}
	};
	const signUp = (e: any) => {
		if (e.type === "click" || (e.type === "keydown" && e.code === "Enter")) {
			if (!userName) {
				setLoginError("Please enter an user name");
				return;
			}
			if (userName && userName.length < 4) {
				setLoginError("User name have at last 4 characters");
				return;
			}
			if (!email) {
				setLoginError("Please enter an email");
				return;
			}
			if (email && !email.includes("@")) {
				setLoginError("Email not correct");
				return;
			}
			if (!password) {
				setLoginError("Please enter a password");
				return;
			}
			if (password && password?.length < 8) {
				setLoginError("Password have at last 8 characters");
				return;
			}
			if (!confirmPassword) {
				setLoginError("Please enter an confirm password");
				return;
			}
			if (
				password &&
				confirmPassword &&
				password.trim() !== confirmPassword.trim()
			) {
				setLoginError("Password and confirm password must the same");
				return;
			}
			if (
				email &&
				password &&
				email.includes("@") &&
				password.length >= 8 &&
				userName &&
				userName.length >= 4 &&
				confirmPassword &&
				password.trim() === confirmPassword.trim()
			) {
				const data = {
					email,
					userName,
					password,
					confirmPassword,
				};
				apiSignUp(data)
					.then(() => {
						setLoginError("Success");
						navigate("/login", { replace: true });
					})
					.catch((error) => {
						if (error.response.data.message) {
							setLoginError(error.response.data.message);
							return;
						}

						setLoginError("Something went wrong!!!");
					});
			}
		}
	};
	return (
		<div className="login_page">
			<div className="switch">
				<label className={`login ${!isLogin && "checked"}`}>
					<input
						type="checkbox"
						id="checkbox"
						className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
						onClick={handleChecked}
					/>
					<span className="cursor-pointer w-1/2 p-2 z-20">Log in</span>
					<span className="cursor-pointer w-1/2 p-2 z-20">Sign up</span>
				</label>
			</div>
			<div className="card-wrap">
				<div className={`card-wrapper ${!isLogin && "rotate"}`}>
					<div className="card-front">
						<h4 className="text-center text-3xl font-bold mb-8">Log in</h4>
						{loginError && (
							<div className="mb-4 text-red-500 text-center">{loginError}</div>
						)}
						<form
							onKeyDown={(e) => login(e)}
							className="flex justify-center items-center flex-wrap"
						>
							<div className="flex justify-between mb-4 relative">
								<input
									type="email"
									placeholder="Your email"
									autoComplete="off"
									value={email}
									name="email"
									onChange={(e) => handleChangeInput(e, setEmail)}
								/>
								<MailIcon className="icon" />
							</div>
							<div className="flex justify-between mb-4 relative">
								<input
									value={password}
									name="password"
									type={typePassword}
									placeholder="Your password"
									autoComplete="off"
									onChange={(e) => handleChangeInput(e, setPassword)}
								/>
								<KeyIcon className="icon" />
								{typePassword === "password" ? (
									<EyeOffIcon
										onClick={() => {
											setTypePassword("text");
										}}
										className="w-4 h-4 absolute right-4 top-1/2 translate-y-[-50%] cursor-pointer"
									/>
								) : (
									<EyeIcon
										onClick={() => {
											setTypePassword("password");
										}}
										className="w-4 h-4 absolute right-4 top-1/2 translate-y-[-50%] cursor-pointer"
									/>
								)}
							</div>
							<div className="w-full uppercase tracking-wider border-none my-4 flex justify-center items-center">
								<span
									onClick={(e) => login(e)}
									className="bg-secondary text-white px-8 py-2 rounded-lg shadow-[2px_2px_5px_#666666,-2px_-2px_5px_#ffffff] cursor-pointer transition-all active:translate-y-1"
								>
									Log in
								</span>
							</div>
							<Link className="underline hover:text-secondary" to="/forgot-password">
								Forgot password?
							</Link>
						</form>
					</div>
					<div className="card-back">
						<h4 className="text-center text-3xl font-bold mb-4">Sign up</h4>
						{loginError && (
							<div className="mb-4 text-red-500 text-center">{loginError}</div>
						)}
						<form
							onKeyDown={(e) => signUp(e)}
							className="flex justify-center items-center flex-wrap"
						>
							<div className="flex justify-between mb-4 relative">
								<input
									value={userName}
									className=""
									type="text"
									name="userName"
									placeholder="User name"
									autoComplete="off"
									onChange={(e) => handleChangeInput(e, setUserName)}
								/>
								<UserIcon className="icon" />
							</div>
							<div className="flex justify-between mb-4 relative">
								<input
									value={email}
									className=""
									type="email"
									name="signUpEmail"
									placeholder="Your email"
									autoComplete="off"
									onChange={(e) => handleChangeInput(e, setEmail)}
								/>
								<MailIcon className="icon" />
							</div>
							<div className="flex justify-between mb-4 relative">
								<input
									value={password}
									type="password"
									name="signUpPassword"
									placeholder="Your password"
									autoComplete="off"
									onChange={(e) => handleChangeInput(e, setPassword)}
								/>
								<KeyIcon className="icon" />
							</div>
							<div className="flex justify-between mb-4 relative">
								<input
									value={confirmPassword}
									type="password"
									name="confirmPassword"
									placeholder="Confirm your password"
									autoComplete="off"
									onChange={(e) => handleChangeInput(e, setConfirmPassword)}
								/>
								<KeyIcon className="icon" />
							</div>
							<div className="w-full uppercase tracking-wider flex justify-center items-center mt-2">
								<span
									onClick={(e) => signUp(e)}
									className="px-8 py-2 border-none text-white bg-secondary rounded-lg shadow-[2px_2px_5px_#666666,-2px_-2px_5px_#ffffff] cursor-pointer transition-all active:translate-y-1"
								>
									Sign up
								</span>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
