import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../redux/service";

const ForgotPassword = (): JSX.Element => {
	const [email, setEmail] = useState("");
	const [notification, setNotification] = useState("");

	const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleForgotPassword = () => {
		if (!email) {
			setNotification("Please enter your email");
		}
		if (email && !email.includes("@")) {
			setNotification("Email not correct format");
		}
		if (email && email.includes("@")) {
			forgotPassword({ email })
				.then((data) => {
					if (data.data.status === "success") {
						setEmail("");
						setNotification(
							"An email has been sent to your mail. Please check out your mail to reset password"
						);
					}
				})
				.catch(() => {
					setNotification("Something wrong. Please try again!");
				});
		}
	};

	return (
		<section className="w-1/3 h-2/3 bg-primary py-8 px-12 border-2 m-auto relative top-1/2 translate-y-[-50%] rounded-xl">
			<h4 className="text-3xl font-bold mb-4">Reset your password</h4>
			<p className="mb-8">
				We{"'"}ll email you instructions to reset the password.
			</p>
			{notification && <div className="mb-4 text-red-500">{notification}</div>}
			<label className="block mb-2 font-bold" form="email">
				Email
			</label>
			<input
				className="rounded-sm h-10 w-full mb-4 px-4 py-2 focus:border-none focus:outline-none"
				type="email"
				name="email"
				autoComplete="off"
				value={email}
				onChange={(e) => handleChangeEmail(e)}
			/>
			<div className="text-center my-8">
				<span
					onClick={handleForgotPassword}
					className="px-8 py-2 rounded-lg bg-white cursor-pointer"
				>
					Reset Password
				</span>
			</div>
			<Link
				className="text-center underline flex justify-center hover:text-gray-500"
				to="/login"
			>
				Return to login
			</Link>
		</section>
	);
};

export default ForgotPassword;
