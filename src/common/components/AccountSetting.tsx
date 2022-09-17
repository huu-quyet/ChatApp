import React, { useEffect, useState } from "react";
import axios from "axios";
import { CameraIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";

import Avatar from "./Avatar";
import ChangePasswordPopup from "./ChangePasswordPopup";
import { IUser } from "../../module/chat/utils/types";
import { loginActions } from "../../module/login/redux/reducer";
import { updateUserInfo } from "../../module/login/redux/service";
import { RootState } from "../store/store";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/huuquyet/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "huuquyet";

const AccountSetting = (): JSX.Element => {
	const user = useSelector((state: RootState) => state.auth.user);

	const [isChangePassword, setIsChangePassword] = useState(false);
	const [userName, setUserName] = useState("");

	const userId: IUser[] = [user];
	const dispatch = useDispatch();

	useEffect(() => {
		setUserName(user?.userName);
	}, [user?.userName]);

	const changePassword = () => {
		setIsChangePassword(!isChangePassword);
	};

	const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value);
	};

	const submitChangeUserName = () => {
		updateUserInfo({ userName }).then((res) => {
			if (res.data.status === "success") {
				localStorage.setItem("userInfo", JSON.stringify(res.data.user));
				dispatch(loginActions.login(res.data.user));
			}
		});
	};

	const onChangeImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length !== 0 && e.target.files) {
			const file = e.target.files[0];
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
			const res = await axios.post(CLOUDINARY_URL, formData);
			if (res.data.secure_url) {
				updateUserInfo({ avatar: res.data.secure_url }).then((res) => {
					if (res.data.status === "success") {
						localStorage.setItem("userInfo", JSON.stringify(res.data.user));
						dispatch(loginActions.login(res.data.user));
					}
				});
			}
		}
	};

	return (
		<div className="w-full h-full mt-12 mx-4 flex flex-col">
			<div className="flex justify-center items-center flex-col">
				<div className="w-16 h-16 bg-slate-400 relative rounded-full">
					<Avatar userId={userId} />
					<input
						type="file"
						className="h-6 w-6 absolute bottom-0 right-0 z-10 opacity-0"
						onChange={(e) => {
							onChangeImg(e);
						}}
					></input>
					<CameraIcon className="h-6 w-6 absolute bottom-0 right-0 z-0" />
				</div>
				<span>{user.userName}</span>
			</div>
			<div className="flex flex-wrap">
				<label htmlFor="userName" className="w-full">
					User Name
				</label>
				<div>
					<input
						id="userName"
						name="userName"
						type="text"
						className="text-black outline-none border-0 rounded-sm px-2 py-[2px] mb-2"
						defaultValue={userName}
						onChange={(e) => {
							onChangeUserName(e);
						}}
					/>
					<button
						onClick={submitChangeUserName}
						className="ml-4 bg-secondary px-2 py-1 rounded-sm"
					>
						Change
					</button>
				</div>
				<div className="flex w-full flex-wrap">
					<label htmlFor="email" className="w-full">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="text"
						className="text-black outline-none border-0 rounded-sm px-2 py-[2px] mb-2 cursor-not-allowed"
						defaultValue={user?.email}
						disabled
					/>
				</div>
				<p
					onClick={changePassword}
					className="block underline w-full hover:text-green-400 cursor-pointer mt-4 mb-2"
				>
					Change password
				</p>
				{isChangePassword && <ChangePasswordPopup onClose={changePassword} />}
			</div>
		</div>
	);
};

export default AccountSetting;
