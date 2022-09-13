import React, { useState } from "react";
import {
	CheckCircleIcon,
	CogIcon,
	LogoutIcon,
	XIcon,
} from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import ActiveStatus from "./ActiveStatus";
import AccountSetting from "./AccountSetting";

type TProp = {
	isOpen: boolean;
	onClose: () => void;
};

const PopupUserSetting = ({ isOpen, onClose }: TProp): JSX.Element => {
	const [isActiveStatus, setIsActiveStatus] = useState(true);
	const [isAccountSetting, setIsAccountSetting] = useState(false);
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("userInfo");
		localStorage.removeItem("expireTime");
		localStorage.removeItem("currentRoom");
		onClose();
		navigate("/login", { replace: true });
	};

	const handleActiveStatus = () => {
		setIsActiveStatus(true);
		setIsAccountSetting(false);
	};

	const handleAccountSetting = () => {
		setIsActiveStatus(false);
		setIsAccountSetting(true);
	};
	return (
		<>
			{isOpen && (
				<>
					<div
						onClick={onClose}
						className="w-screen h-screen z-10 absolute top-0 left-0 opacity-60 bg-white"
					></div>
					<div className="w-[45%] h-96 bg-primary text-white shadow-sm rounded-xl z-20 absolute left-1/2 translate-x-[-50%] translate-y-[50%]">
						<XIcon
							onClick={onClose}
							className="h-8 w-8 absolute mx-4 my-2 top-0 right-0 cursor-pointer hover:bg-green-700 rounded-xl"
						/>
						<div className="flex w-full h-full">
							<div className="w-[30%] h-full border-r-2">
								<div className="mt-12 flex flex-wrap">
									<div
										onClick={handleActiveStatus}
										className={`w-full py-1 pl-4 mb-4 cursor-pointer flex items-center justify-start transition-all ${
											isActiveStatus && "bg-secondary"
										}`}
									>
										<CheckCircleIcon className="w-8 h-8 mr-2" />
										<span>Active Status</span>
									</div>
									<div
										onClick={handleAccountSetting}
										className={`w-full py-1 pl-4 mb-4 cursor-pointer flex items-center justify-start transition-all ${
											isAccountSetting && "bg-secondary"
										}`}
									>
										<CogIcon className="w-8 h-8 mr-2" />
										<span>Account</span>
									</div>
									<div
										onClick={handleLogout}
										className="w-full py-1 pl-5 cursor-pointer flex items-center justify-start"
									>
										<LogoutIcon className="w-8 h-8 mr-2" /> <span>Log Out</span>
									</div>
								</div>
							</div>
							<div className="w-[70%] h-full">
								{isActiveStatus && <ActiveStatus />}
								{isAccountSetting && <AccountSetting />}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default PopupUserSetting;
