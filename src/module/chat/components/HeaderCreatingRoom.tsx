import React, { useCallback } from "react";
import { formatTextVN } from "../../../utils/function/Index";
import { chatActions } from "../redux/reducer";
import { fetchSearchFriends } from "../redux/service";
import lodash from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import { IRoom, IUser } from "../utils/types";
import socket, { EVENTS } from "../../../utils/socket";
import { CheckIcon, UserIcon, XIcon } from "@heroicons/react/outline";

type TProps = {
	allowCreate: boolean;
	searchFriends: string;
	setSearchFriends: any;
	setAllowCreate: any;
};

const HeaderCreatingRoom = ({
	allowCreate,
	searchFriends,
	setSearchFriends,
	setAllowCreate,
}: TProps): JSX.Element => {
	const { isCreatingRoom, searchedFriends, usersSelected, rooms } = useSelector(
		(state: RootState) => state.chats
	);
	const dispatch = useDispatch();

	const onChangeSearch = (userName: string) => {
		if (formatTextVN(userName).length > 0) {
			fetchSearchFriends({ userName: userName })
				.then((res) => {
					if (res.data.status === "success") {
						dispatch(
							chatActions.setSearchedFriends({ searchedFriends: res.data.users })
						);
					}
				})
				.catch(() => {
					dispatch(chatActions.setSearchedFriends({ searchedFriends: [] }));
				});
		}

		if (userName.length === 0) {
			dispatch(chatActions.setSearchedFriends({ searchedFriends: [] }));
		}
	};
	const handleChangeDebounce = useCallback(
		lodash.debounce(onChangeSearch, 500),
		[]
	);
	const handleSelectFriend = (user: IUser) => {
		if (usersSelected?.find((item) => item._id === user._id)) {
			return;
		}
		const newUserSelected = [...usersSelected, user];
		dispatch(chatActions.setUsersSelected({ usersSelected: newUserSelected }));
	};

	const handleRemoveUser = (user: IUser) => {
		if (usersSelected?.find((item) => item._id === user._id)) {
			const newUserSelected = usersSelected?.filter(
				(item) => item._id !== user._id
			);
			dispatch(chatActions.setUsersSelected({ usersSelected: newUserSelected }));
		}
	};

	const handleCancel = () => {
		setSearchFriends("");
		dispatch(chatActions.setSearchedFriends({ searchedFriends: [] }));
	};

	const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchFriends(event.target.value);
		handleChangeDebounce(event.target.value);
	};

	const handleCreateRoom = () => {
		if (isCreatingRoom && allowCreate && usersSelected?.length > 0) {
			const user = localStorage.getItem("userInfo");
			if (user) {
				const chatName = usersSelected
					.reduce((acc, cur) => {
						return acc + cur.userName + ", ";
					}, "")
					.trim();
				const newRoom = {
					userCreate: JSON.parse(user)?._id,
					name: chatName.slice(0, chatName.length - 1),
					userId: usersSelected.reduce((acc: string[], cur: IUser) => {
						return [...acc, cur._id];
					}, []),
					message: [],
				};
				socket.emit(EVENTS.CLIENT.CREATE_ROOM, newRoom, (response: IRoom) => {
					const newRooms = [response, ...rooms];
					dispatch(chatActions.updateRoom(newRooms));
					dispatch(chatActions.setIsCreatingRoom(false));
					dispatch(chatActions.setUsersSelected({ usersSelected: [] }));
					dispatch(chatActions.setCurrentRoom({ currentRoom: response }));
					setSearchFriends("");
					setAllowCreate(false);
					dispatch(chatActions.updateMesInit());
				});
			}
		}
	};
	return (
		<div className="col-start-1 col-end-4 flex items-center">
			<span className="font-bold mr-2">To:</span>
			<div className="relative">
				<input
					value={searchFriends}
					className="h-5 border-none outline-none bg-gray-100 px-2 py-4 rounded-sm"
					placeholder="Enter your friends name"
					onChange={handleChangeSearch}
				/>
				<XIcon
					onClick={handleCancel}
					className="w-3 h-3 absolute top-1/2 right-2 translate-y-[-50%] hover:bg-white rounded-full"
				/>
			</div>
			<div className="mx-4 max-h-[100%] w-[70%] p-0 flex flex-wrap gap-1 overflow-y-auto">
				{usersSelected?.length > 0 && (
					<>
						{usersSelected.map((user) => {
							return (
								<span
									key={user._id}
									className="flex items-center px-2 py-1 rounded-sm bg-gray-100 mr-2"
								>
									<span>{user.userName}</span>
									<XIcon
										onClick={() => {
											handleRemoveUser(user);
										}}
										className="h-3 w-3 ml-4 hover:bg-white rounded-full"
									/>
								</span>
							);
						})}
					</>
				)}
			</div>
			<div className="">
				{usersSelected?.length > 0 && (
					<CheckIcon
						onClick={handleCreateRoom}
						className={`h-8 w-8 text-white rounded-full cursor-pointer  ${
							allowCreate ? "bg-primary" : "bg-red-500"
						}`}
					/>
				)}
			</div>
			{searchedFriends?.length > 0 && (
				<div className="w-64 bg-white max-h-72 shadow-lg rounded-sm absolute top-20 left-4 overflow-y-scroll z-10">
					{searchedFriends?.map((user) => (
						<div
							onClick={() => {
								handleSelectFriend(user);
							}}
							className="w-full px-2 py-1 flex items-center cursor-pointer hover:bg-gray-100"
							key={user._id}
						>
							{user?.avatar ? (
								<img className="w-8 h-8 rounded-full" src={user?.avatar}></img>
							) : (
								<span className="w-8 h-8 rounded-full bg-gray-300 relative inline-block">
									<UserIcon className="h-4 w-4 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
								</span>
							)}
							<span className="ml-2 max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
								{user.userName}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default HeaderCreatingRoom;
