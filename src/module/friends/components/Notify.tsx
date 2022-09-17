import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { IUser } from "../../chat/utils/types";
import { friendsAction } from "../redux/reducer";
import { getListUserInfoNotify } from "../redux/service";

const Notify = (): JSX.Element => {
	const [users, setUsers] = useState<IUser[] | []>([]);

	const dispatch = useDispatch();

	useEffect(() => {
		getListUserInfoNotify().then((res) => {
			if (res.data.status === "success") {
				setUsers(res.data.waitingApproval);
			}
		});
	}, []);

	const handleSelectUser = (id: string) => {
		dispatch(friendsAction.setSelectedUser({ userId: id }));
	};

	return (
		<div className="w-[92%] h-60 bg-secondary absolute z-20 right-8 top-12 shadow-xl overflow-hidden overflow-y-auto">
			{users?.length > 0 ? (
				<>
					{users?.map((item) => {
						return (
							<div
								key={item._id}
								onClick={() => {
									handleSelectUser(item._id);
								}}
								className="px-4 py-2 my-1 bg-gray-100 cursor-pointer"
							>
								<span className="font-bold text-lg break-words">{item.userName}</span>{" "}
								<span>muốn kết bạn với bạn</span>
							</div>
						);
					})}
				</>
			) : (
				<div className="text-xl font-bold text-center mt-24">
					Empty Notification
				</div>
			)}
		</div>
	);
};

export default Notify;
