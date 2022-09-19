import React, { useState, useCallback } from "react";
import { UserIcon, XIcon } from "@heroicons/react/outline";
import lodash from "lodash";

import { IUser } from "../../chat/utils/types";
import { searchUserByUserName } from "../redux/service";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { friendsAction } from "../redux/reducer";

const SearchFriend = (): JSX.Element => {
	const [valueFriends, setValueFriends] = useState("");
	const [searchFriends, setSearchFriends] = useState<IUser[] | []>([]);
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onHandleSearchUser = (userName: string) => {
		if (userName.length > 0) {
			setIsLoading(true);
			searchUserByUserName(userName.trim())
				.then((res) => {
					if (res.data.status === "success") {
						setSearchFriends(res.data.users);
						setIsLoading(false);
					}
					setIsLoading(false);

					return;
				})
				.catch(() => {
					setIsLoading(false);
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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValueFriends(event.target.value);
		handleChangeDebounce(event.target.value);
	};

	const handleCloseSearch = () => {
		setValueFriends("");
		setSearchFriends([]);
	};

	const handleSelectUser = (user: IUser) => {
		dispatch(friendsAction.setSelectedUser({ userId: user._id }));
		navigate(`/friends/${user?._id}`);
	};

	return (
		<div className="mb-4 mr-8 relative">
			<div className="">
				<input
					onChange={handleChange}
					value={valueFriends}
					className="h-10 w-full border-t border-b px-2 py-2 outline-none focus:border-green-500"
					placeholder="Add friends..."
				/>
				{isLoading ? (
					<div className="w-3 h-3 rounded-full absolute top-[14px] right-6 border-2 border-l-transparent border-primary animate-spin"></div>
				) : (
					<XIcon
						onClick={handleCloseSearch}
						className="h-6 w-6 absolute top-1/2 right-4 translate-y-[-50%] text-gray-300"
					/>
				)}
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
	);
};

export default SearchFriend;
