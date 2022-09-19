import React from "react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/outline";
import { IUser } from "../../module/chat/utils/types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type TProp = {
	userId: IUser[];
	optionClass?: string;
};

const Avatar = ({ userId }: TProp): JSX.Element => {
	const { user } = useSelector((state: RootState) => state.auth);

	const getUrlImg = () => {
		let url = "";

		if (userId && userId.length >= 2) {
			const members = userId.filter((member) => member._id !== user._id);
			url = members[0]?.avatar || "";
		}

		return url;
	};
	return (
		<>
			{userId &&
				(userId?.length > 2 ? (
					userId[0]?.avatar ? (
						<img
							src={getUrlImg()}
							className="h-full w-full rounded-full object-cover"
						></img>
					) : (
						<UserGroupIcon className="h-6 w-6 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
					)
				) : userId[0]?.avatar ? (
					<img
						src={getUrlImg()}
						className="h-full w-full rounded-full object-cover"
					></img>
				) : (
					<UserIcon className="h-6 w-6 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
				))}
		</>
	);
};

export default Avatar;
