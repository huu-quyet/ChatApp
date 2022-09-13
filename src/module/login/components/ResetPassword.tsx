import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../redux/service";

const ResetPassword = (): JSX.Element => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [notification, setNotification] = useState("");
	const params = useParams();

	const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleChangeConfirmPassword = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(e.target.value);
	};

	const handleSubmitChangePassword = () => {
		if (!password) {
			setNotification("Please enter a password");
			return;
		}
		if (!confirmPassword) {
			setNotification("Please enter a confirm password");
		}
		if (
			password &&
			confirmPassword &&
			password.trim() === confirmPassword.trim()
		) {
			const resetToken = params.resetToken ? params.resetToken : "";
			resetPassword(resetToken, { password, confirmPassword })
				.then((data) => {
					if (data.data.status === "success") {
						setPassword("");
						setConfirmPassword("");
						setNotification("Password changed successful!!!");
					}
				})
				.catch(() => {
					setNotification("Something wrong. Please try again!");
				});
		}
	};
	return (
		<div className="w-1/3 h-2/3 bg-green-300 py-8 px-12 border-2 m-auto relative top-1/2 translate-y-[-50%] rounded-xl">
			<h4 className="text-3xl font-bold mb-8">Reset your password</h4>
			{notification && <div className="text-red-500 mb-4">{notification}</div>}
			<label className="block mb-1 font-bold" form="password">
				Password
			</label>
			<input
				className="rounded-md h-10 w-full mb-6 px-4 py-2 focus:border-none focus:outline-none"
				type="password"
				name="password"
				autoComplete="off"
				value={password}
				onChange={(e) => handleChangePassword(e)}
			/>
			<label className="block mb-1 font-bold" form="confirmPassword">
				Confirm password
			</label>
			<input
				className="rounded-md h-10 w-full mb-4 px-4 py-2 focus:border-none focus:outline-none"
				type="password"
				name="confirmPassword"
				autoComplete="off"
				value={confirmPassword}
				onChange={(e) => handleChangeConfirmPassword(e)}
			/>
			<div className="text-center my-8">
				<span
					onClick={handleSubmitChangePassword}
					className="px-8 py-2 uppercase rounded-md bg-white cursor-pointer"
				>
					Submit
				</span>
			</div>
			<Link
				className="text-center underline flex justify-center hover:text-gray-500"
				to="/login"
			>
				Return to login
			</Link>
		</div>
	);
};

export default ResetPassword;
