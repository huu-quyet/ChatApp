import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, XIcon } from "@heroicons/react/outline";
import { changePassword } from "../../module/login/redux/service";
import { loginActions } from "../../module/login/redux/reducer";
import { useDispatch } from "react-redux";

type TProps = {
	onClose: () => void;
};

const ChangePasswordPopup = ({ onClose }: TProps): JSX.Element => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [statusChangePassword, setStatusChangePassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [typeCurrentPassword, setTypeCurrentPassword] = useState("password");
	const [typeNewPassword, setTypeNewPassword] = useState("password");
	const [typeConfirmNewPassword, setTypeConfirmNewPassword] =
		useState("password");

	const dispatch = useDispatch();

	const changeInput = (
		e: React.ChangeEvent<HTMLInputElement>,
		setInput: React.Dispatch<React.SetStateAction<string>>
	) => {
		setInput(e.target.value);
	};
	const submitChangePassword = () => {
		if (isLoading) {
			return;
		}
		if (currentPassword.length === 0) {
			setStatusChangePassword("The current password can not be blank!");
			return;
		}
		if (
			currentPassword.length > 0 &&
			(newPassword.length === 0 ||
				confirmNewPassword.length === 0 ||
				newPassword.trim() !== confirmNewPassword.trim())
		) {
			setStatusChangePassword(
				"The new password is not the same as the confirmed password!"
			);
			return;
		} else if (confirmNewPassword.length < 8 || newPassword.length < 8) {
			setStatusChangePassword("The new password needs at least 8 characters");
			return;
		}
		setIsLoading(true);
		changePassword({
			passwordCurrent: currentPassword,
			password: newPassword,
			passwordConfirm: confirmNewPassword,
		})
			.then((data) => {
				if (data.data.status === "success") {
					localStorage.setItem("userInfo", JSON.stringify(data.data.data));
					localStorage.setItem("expireTime", JSON.stringify(data.data.expireTime));
					localStorage.setItem("token", JSON.stringify(data.data.token));
					setIsLoading(false);
					setCurrentPassword("");
					setNewPassword("");
					setConfirmNewPassword("");
					setStatusChangePassword("Successful");
					dispatch(loginActions.login(data.data.data));
				}
			})
			.catch((err) => {
				setIsLoading(false);
				setStatusChangePassword(err.response.data.message);
			});
	};
	return (
		<div className="absolute top-1/2 left-[30%] rounded-tr-xl rounded-br-xl translate-y-[-50%] w-[70%] z-30 h-full bg-primary">
			<XIcon
				onClick={onClose}
				className="h-8 w-8 absolute mx-4 my-2 top-0 right-0 cursor-pointer hover:bg-secondary rounded-xl"
			/>
			<h2 className="block text-3xl text-center mt-10 font-bold mb-4">
				Change Password
			</h2>
			<div className="absolute mt-8 w-1/2 top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] ">
				<div className="flex flex-wrap">
					<label htmlFor="currentPassword" className="w-full">
						Current Password
					</label>
					<div className="w-full relative">
						<input
							id="currentPassword"
							name="currentPassword"
							type={typeCurrentPassword}
							className="text-black w-full outline-none border-0 rounded-sm px-2 py-[2px] mb-2"
							value={currentPassword}
							onChange={(e) => changeInput(e, setCurrentPassword)}
						/>
						{typeCurrentPassword === "password" ? (
							<EyeOffIcon
								onClick={() => {
									setTypeCurrentPassword("text");
								}}
								className="h-5 w-5 text-green-700 absolute top-1 right-2"
							/>
						) : (
							<EyeIcon
								onClick={() => {
									setTypeCurrentPassword("password");
								}}
								className="h-5 w-5 text-green-700 absolute top-1 right-2"
							/>
						)}
					</div>
				</div>
				<div className="flex flex-wrap">
					<label htmlFor="newPassword" className="w-full">
						New Password
					</label>
					<div className="w-full relative">
						<input
							id="newPassword"
							name="newPassword"
							type={typeNewPassword}
							className="text-black w-full outline-none border-0 rounded-sm px-2 py-[2px] mb-2"
							value={newPassword}
							onChange={(e) => changeInput(e, setNewPassword)}
						/>
						{typeNewPassword === "password" ? (
							<EyeOffIcon
								onClick={() => {
									setTypeNewPassword("text");
								}}
								className="h-5 w-5 text-green-700 absolute top-1 right-2"
							/>
						) : (
							<EyeIcon
								onClick={() => {
									setTypeNewPassword("password");
								}}
								className="h-5 w-5 text-green-700 absolute top-1 right-2"
							/>
						)}
					</div>
				</div>
				<div className="flex flex-wrap">
					<label htmlFor="confirmNewPassword" className="w-full">
						Confirm New Password
					</label>
					<div className="w-full relative">
						<input
							id="confirmNewPassword"
							name="confirmNewPassword"
							type={typeConfirmNewPassword}
							className="text-black w-full outline-none border-0 rounded-sm px-2 py-[2px] mb-2"
							value={confirmNewPassword}
							onChange={(e) => changeInput(e, setConfirmNewPassword)}
						/>
						{typeConfirmNewPassword === "password" ? (
							<EyeOffIcon
								onClick={() => {
									setTypeConfirmNewPassword("text");
								}}
								className="h-5 w-5 text-green-700 absolute top-1 right-2"
							/>
						) : (
							<EyeIcon
								onClick={() => {
									setTypeConfirmNewPassword("password");
								}}
								className="h-5 w-5 text-green-700 absolute top-1 right-2"
							/>
						)}
					</div>
				</div>
				{statusChangePassword && (
					<p className="w-full text-red-600">{statusChangePassword}</p>
				)}
				<button
					onClick={submitChangePassword}
					className="rounded-sm w-full mt-4 py-1 bg-secondary flex items-center justify-center"
				>
					{isLoading && (
						<span className="w-5 h-5 mx-3 animate-spin border-4 rounded-t-full rounded-b-full border-l-transparent inline-block"></span>
					)}
					{!isLoading && <span>Submit</span>}
				</button>
			</div>
		</div>
	);
};

export default ChangePasswordPopup;
