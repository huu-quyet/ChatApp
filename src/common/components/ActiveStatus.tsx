import React from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { postUpdateActiveStatus } from "../../module/login/redux/reducer";
import { RootState } from "../store/store";

const ActiveStatus = (): JSX.Element => {
	const user = useSelector((state: RootState) => state.auth.user);
	const dispatch: Dispatch<any> = useDispatch();

	const handleUpdateActiveStatus = () => {
		dispatch(postUpdateActiveStatus({ online: !user?.online }));
	};
	return (
		<div className="w-full h-full mt-12 mx-4 flex flex-col">
			<div className="pb-8">
				<p className="text-xl font-bold mb-2">Active Status</p>
				<p className="mb-1">Show active status</p>
				<div
					className={`w-14 h-5 mb-1 rounded-xl transition-all before:absolute before:rounded-full before:content-[''] before:w-3 before:h-3 before:mt-[0.1rem] before:ml-1 border-2 border-white ${
						user?.online
							? "bg-primary before:bg-white before:translate-x-[1.75rem]"
							: "bg-white before:bg-primary"
					}`}
				>
					<input
						onClick={handleUpdateActiveStatus}
						type="checkbox"
						className="w-full h-full opacity-0"
					/>
				</div>
				<p className="font-bold">Active Status: {user?.online ? "On" : "Off"}</p>
			</div>
			<p className="">
				Your friends and contacts will see when you are active. You will appear
				active unless you turn off the setting. You will also see when your friends
				and contacts are active.
			</p>
		</div>
	);
};

export default ActiveStatus;
