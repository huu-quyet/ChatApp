/* eslint-disable indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import { chatActions } from "../redux/reducer";
import { IUser } from "../utils/types";
import { DotsHorizontalIcon, VideoCameraIcon } from "@heroicons/react/outline";
import Avatar from "../../../common/components/Avatar";
import HeaderCreatingRoom from "./HeaderCreatingRoom";

const Header = (): JSX.Element => {
	const { currentRoom, isCreatingRoom, usersSelected, rooms, showPopup } =
		useSelector((state: RootState) => state.chats);
	const [searchFriends, setSearchFriends] = useState("");
	const [allowCreate, setAllowCreate] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (usersSelected?.length > 0) {
			const roomExisted = rooms.filter((room) =>
				usersSelected?.every((user) =>
					room?.userId?.findIndex((u) => u._id === user._id) !== -1 ? true : false
				)
			);

			if (
				roomExisted?.filter(
					(room) => room.userId.length === usersSelected?.length + 1
				).length > 0
			) {
				setAllowCreate(false);
			} else {
				setAllowCreate(true);
			}
		}
	}, [usersSelected]);

	useEffect(() => {
		if (!isCreatingRoom) {
			setSearchFriends("");
			dispatch(chatActions.setSearchedFriends({ searchedFriends: [] }));
			dispatch(chatActions.setUsersSelected({ usersSelected: [] }));
		}
	}, [isCreatingRoom]);

	return (
		<div
			className={`h-[12%] min-w-full grid grid-cols-[0.2fr_3fr_0.2fr] py-4 px-4 mb-[2px] relative ${
				currentRoom?.userId?.length > 2
					? "grid-rows-[2rem_2rem]"
					: "grid-rows-[4rem]"
			}
`}
		>
			{isCreatingRoom ? (
				<HeaderCreatingRoom
					searchFriends={searchFriends}
					allowCreate={allowCreate}
					setSearchFriends={setSearchFriends}
					setAllowCreate={setAllowCreate}
				/>
			) : (
				<>
					<div className="w-[3rem] mr-4 row-start-1 row-end-3 flex items-center">
						<span className="w-12 h-12 block rounded-full relative bg-bg1">
							<Avatar userId={currentRoom?.userId} />
						</span>
					</div>
					<div className="font-bold w-80 flex items-center">
						<span className="w-full whitespace-nowrap overflow-hidden text-ellipsis text-2xl">
							{currentRoom?.name?.length > 0
								? currentRoom?.name
								: currentRoom?.userId?.reduce((acc: string, cur: IUser) => {
										return acc + cur.userName + ", ";
								  }, "")}
						</span>
					</div>
					{currentRoom?.userId?.length > 2 && (
						<div className="w-full col-start-2 col-end-3 row-start-2 row-end-3 text-sm flex items-center">
							{currentRoom?.userId?.length} member
						</div>
					)}

					<div className="row-start-1 row-end-3 col-start-3 col-end-4 flex items-center gap-4">
						{currentRoom?.userId?.length === 2 ? (
							<VideoCameraIcon className="w-6 h-6" />
						) : null}
						<DotsHorizontalIcon
							onClick={() => {
								dispatch(chatActions.setShowPopup(!showPopup));
							}}
							className="w-6 h-6 hover:cursor-pointer"
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Header;
