import React from "react";
import { useSelector } from "react-redux";
import { UserIcon } from "@heroicons/react/outline";

import { RootState } from "../../../common/store/store";
import { IUser } from "../../chat/utils/types";

type TProps = {
	friend: IUser;
	handleSelectUser: (friend: IUser) => void;
};

const Friend = ({ friend, handleSelectUser }: TProps) => {
	const { userSelected } = useSelector((state: RootState) => state.friends);

	return (
		<div
			onClick={() => {
				handleSelectUser(friend);
			}}
			key={friend?._id}
			className={`px-2 w-full py-2 flex justify-between items-center cursor-pointer ${
				userSelected?._id === friend?._id && "bg-gray-100"
			}`}
		>
			<span className="flex items-center w-full relative">
				{friend?.avatar ? (
					<img
						src={friend.avatar}
						className="h-12 w-12 object-cover rounded-full border-primary border-2"
					/>
				) : (
					<span className="relative w-12 h-12 rounded-full bg-gray-300 inline-block border-primary border-2">
						<UserIcon className="h-8 w-8 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
					</span>
				)}
				<span className="ml-2 font-bold max-w-[70%] block whitespace-nowrap overflow-hidden text-ellipsis">
					{friend?.userName}
				</span>
				{friend?.online && (
					<span className="flex h-3 w-3 absolute left-8 bottom-0">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
						<span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
					</span>
				)}
			</span>
		</div>
	);
};

export default Friend;
