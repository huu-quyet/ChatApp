import React, { useEffect, useState } from "react";
import { CalendarIcon, ChatIcon, UsersIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Avatar from "./Avatar";
import { IUser } from "../../module/chat/utils/types";
import PopupUserSetting from "./PopupUserSetting";

type TProps = {
	href: string;
};

const Header = ({ href }: TProps): JSX.Element => {
	const [token, setToken] = useState("");
	const [openPopup, setOpenPopup] = useState(false);
	const [isShow, setIsShow] = useState(false);
	const user = useSelector((state: RootState) => state.auth.user);
	const currentRoom = useSelector((state: RootState) => state.chats.currentRoom);
	const userId: IUser[] = [user];

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (
			window.location.href.includes("login") ||
			window.location.href.includes("forgot-password") ||
			window.location.href.includes("reset-password-password")
		) {
			setIsShow(false);
		} else {
			setIsShow(true);
		}
		if (token) {
			setToken(JSON.parse(token));
		}
	});

	const handleOpenPopupSetting = () => {
		setOpenPopup(true);
	};
	const handleClosePopupSetting = () => {
		setOpenPopup(false);
	};

	return (
		<>
			{token && user && isShow ? (
				<div className="relative z-10">
					<header className="w-24 h-screen py-12 bg-primary absolute left-0 top-0 flex flex-col justify-between items-center text-white">
						<div className="">
							<Link to={`/messages${currentRoom?._id ? "/" + currentRoom?._id : ""}`}>
								<ChatIcon
									className={`w-8 h-8 text-white mt-6 ${
										href.includes("messages") && "text-secondary"
									}`}
								/>
							</Link>
							<Link to="/friends">
								<div className="relative">
									<UsersIcon
										className={`w-8 h-8 text-white my-8 ${
											href.includes("friends") && "text-secondary"
										}`}
									/>
									{user?.waitingApproval?.length > 0 && (
										<span className="absolute -top-2 -right-1 bg-red-500 w-4 h-4 rounded-full text-xs flex justify-center items-center">
											{user?.waitingApproval?.length}
										</span>
									)}
								</div>
							</Link>
							<Link to="/calendar">
								<CalendarIcon
									className={`w-8 h-8 text-white ${
										href.includes("calendar") && "text-secondary"
									}`}
								/>
							</Link>
						</div>
						<div>
							<div
								onClick={handleOpenPopupSetting}
								className="w-10 h-10 bg-slate-400 relative rounded-full cursor-pointer"
							>
								<Avatar userId={userId} />
							</div>
						</div>
					</header>
					<PopupUserSetting isOpen={openPopup} onClose={handleClosePopupSetting} />
				</div>
			) : (
				<div />
			)}
		</>
	);
};

export default React.memo(Header);
