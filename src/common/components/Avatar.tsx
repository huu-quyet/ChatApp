import React from "react";
import { UserGroupIcon, UserIcon } from "@heroicons/react/outline";
import { IUser } from "../../module/chat/utils/types";

type TProp = {
	userId: IUser[];
	optionClass?: string;
};

const Avatar = ({ userId }: TProp): JSX.Element => {
	return (
		<>
			{userId &&
				(userId?.length > 2 ? (
					userId[0]?.avatar ? (
						<img
							src={userId[0]?.avatar}
							className="h-full w-full rounded-full object-cover"
						></img>
					) : (
						<UserGroupIcon className="h-6 w-6 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
					)
				) : userId[0]?.avatar ? (
					<img
						src={userId[0]?.avatar}
						className="h-full w-full rounded-full object-cover"
					></img>
				) : (
					<UserIcon className="h-6 w-6 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
				))}
		</>
	);
};

export default Avatar;
