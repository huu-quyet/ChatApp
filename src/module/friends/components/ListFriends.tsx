import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../common/store/store";
import { IUser } from "../../chat/utils/types";
import { friendsAction } from "../redux/reducer";

import Notify from "./Notify";
import Friend from "./Friend";
import SearchFriend from "./SearchFriend";

const ListFriends = (): JSX.Element => {
	const { friends, userSelected, loading } = useSelector(
		(state: RootState) => state.friends
	);
	const { user } = useSelector((state: RootState) => state.auth);

	const [isShowNotify, setIsShowNotify] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (userSelected) {
			navigate("/friends", { replace: true });
		}
	}, []);

	const handleSelectUser = (user: IUser) => {
		dispatch(friendsAction.setSelectedUser({ userId: user._id }));
		navigate(`/friends/${user?._id}`);
	};

	const handleShowNotify = () => {
		setIsShowNotify(!isShowNotify);
	};

	return (
		<section className="pt-8 w-1/4 h-screen overflow-hidden">
			<div className="flex justify-between items-center mb-4 relative">
				<h2 className="px-4 text-4xl font-black">Friends</h2>
				<div onClick={handleShowNotify} className="relative cursor-pointer">
					<BellIcon className="h-10 w-10 text-primary mr-12" />
					{user?.waitingApproval?.length > 0 && (
						<span className="bg-red-500 inline-block rounded-full text-xs absolute top-0 right-12 h-4 w-4">
							<span className="flex justify-center items-center">
								{user?.waitingApproval.length}
							</span>
							<span className="animate-ping absolute top-0 right-0 inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
						</span>
					)}
				</div>
				{isShowNotify && <Notify />}
			</div>
			<SearchFriend />
			<aside className="overflow-y-auto overflow-x-hidden h-3/4 w-full box-content pr-12 relative">
				{loading ? (
					<div className="absolute top-1/3 left-32">
						<span className="w-8 h-8 animate-spin border-4 border-primary rounded-t-full rounded-b-full border-l-transparent inline-block" />
					</div>
				) : (
					<>
						{friends?.length > 0 ? (
							<>
								{friends?.map((friend) => {
									return (
										<Friend
											key={friend._id}
											friend={friend}
											handleSelectUser={handleSelectUser}
										/>
									);
								})}
							</>
						) : (
							<div className="text-2xl font-black text-center mt-8">No Friend</div>
						)}
					</>
				)}
			</aside>
		</section>
	);
};

export default ListFriends;
