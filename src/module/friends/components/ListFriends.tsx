import { BellIcon, UserIcon, XIcon } from "@heroicons/react/outline";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import lodash from "lodash";
import { IUser } from "../../chat/utils/types";
import { friendsAction } from "../redux/reducer";
import { searchUserByUserName } from "../redux/service";
import { useNavigate } from "react-router-dom";
import { formatTextVN } from "../../../utils/function/Index";
import Notify from "./Notify";

const ListFriends = (): JSX.Element => {
	const { friends, userSelected } = useSelector(
		(state: RootState) => state.friends
	);
	const { user } = useSelector((state: RootState) => state.auth);

	const [valueFriends, setValueFriends] = useState("");
	const [searchFriends, setSearchFriends] = useState<IUser[] | []>([]);
	const [isShowNotify, setIsShowNotify] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (userSelected) {
			navigate("/friends", { replace: true });
		}
	}, []);

	const onHandleSearchUser = (userName: string) => {
		if (userName.length > 0) {
			searchUserByUserName(userName.trim())
				.then((res) => {
					if (res.data.status === "success") {
						setSearchFriends(res.data.users);
					}
					return;
				})
				.catch(() => {
					setSearchFriends([]);
				});
		}

		if (userName.length === 0) {
			setValueFriends("");
			setSearchFriends([]);
		}
	};

	const handleChangeDebounce = useCallback(
		lodash.debounce(onHandleSearchUser, 500),
		[]
	);

	const handleSelectUser = (user: IUser) => {
		dispatch(friendsAction.setSelectedUser({ userId: user._id }));
		navigate(`/friends/${user?._id}`);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValueFriends(event.target.value);
		handleChangeDebounce(formatTextVN(event.target.value));
	};

	const handleCloseSearch = () => {
		setValueFriends("");
		setSearchFriends([]);
	};

	const handleShowNotify = () => {
		setIsShowNotify(!isShowNotify);
	};

	return (
		<div className="pt-8 w-1/4 h-screen overflow-hidden">
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
			<div className="mb-4 mr-8 relative">
				<div className="">
					<input
						onChange={handleChange}
						value={valueFriends}
						className="h-10 w-full border-t border-b px-2 py-2 outline-none focus:border-green-500"
						placeholder="Add friends..."
					/>
					<XIcon
						onClick={handleCloseSearch}
						className="h-6 w-6 absolute top-1/2 right-4 translate-y-[-50%] text-gray-300"
					/>
				</div>
				{searchFriends.length > 0 && (
					<div className="absolute top-10 left-0 max-h-60 w-full overflow-y-auto bg-white shadow-lg z-10">
						{searchFriends.map((item) => {
							return (
								<div
									onClick={() => {
										handleSelectUser(item);
									}}
									key={item._id}
									className="flex items-center px-2 py-2 hover:bg-gray-100"
								>
									<span className="h-8 w-8 mr-4 relative rounded-full bg-gray-300">
										{item?.avatar ? (
											<img
												src={item?.avatar}
												className="h-full w-full rounded-full object-cover"
											></img>
										) : (
											<UserIcon className="h-6 w-6 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
										)}
									</span>
									<span className="max-w-[80%] whitespace-nowrap text-ellipsis overflow-hidden">
										{item.userName}
									</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
			<div className="overflow-y-auto overflow-x-hidden h-3/4 w-full box-content pr-12">
				{friends.map((friend) => {
					return (
						<div
							onClick={() => {
								handleSelectUser(friend);
							}}
							key={friend._id}
							className={`px-2 w-full py-2 flex justify-between items-center cursor-pointer ${
								userSelected?._id === friend._id && "bg-gray-100"
							}`}
						>
							<span className="flex items-center w-full relative">
								{friend?.avatar ? (
									<img
										src={friend.avatar}
										className="h-12 w-12 object-cover rounded-full"
									/>
								) : (
									<span className="relative w-12 h-12 rounded-full bg-gray-300 inline-block">
										<UserIcon className="h-8 w-8 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
									</span>
								)}
								<span className="ml-2 font-bold max-w-[70%] block whitespace-nowrap overflow-hidden text-ellipsis">
									{friend.userName}
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
				})}
			</div>
		</div>
	);
};

export default ListFriends;
