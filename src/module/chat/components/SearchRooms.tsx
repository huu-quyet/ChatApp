import React, { useCallback, useState } from "react";
import lodash from "lodash";
import { XIcon } from "@heroicons/react/outline";
import { useDispatch } from "react-redux";

import { searchRooms } from "../redux/service";
import { IRoom } from "../utils/types";
import Avatar from "../../../common/components/Avatar";
import { chatActions } from "../redux/reducer";
import { formatTextVN } from "../../../utils/function/Index";

type TProps = {
	handleChooseRoom: (room: IRoom) => void;
};

const SearchRooms = ({ handleChooseRoom }: TProps): JSX.Element => {
	const [roomSearch, setRoomSearch] = useState<IRoom[] | []>([]);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();

	const onChangeSearch = (search: string) => {
		if (search.length === 0) {
			setRoomSearch([]);
			setIsLoading(false);
		}
		if (search.length !== 0) {
			setIsLoading(true);
			searchRooms({ search: search })
				.then((res) => {
					if (res.data.status === "success") {
						setRoomSearch(res.data.rooms);
						setIsLoading(false);
					}
				})
				.catch((err) => {
					setIsLoading(false);
					console.log(err);
				});
		}
	};

	const handleChangeDebounce = useCallback(
		lodash.debounce(onChangeSearch, 500),
		[]
	);

	const handleFocus = () => {
		dispatch(chatActions.setIsCreatingRoom(false));
		dispatch(chatActions.setSearchedFriends({ searchedFriends: [] }));
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		handleChangeDebounce(formatTextVN(event.target.value));
	};

	const handleChooseChat = (room: IRoom) => {
		handleChooseRoom(room);
	};

	return (
		<div className="mb-4 mt-[14px] mr-8 relative">
			<div className="w-full relative">
				<input
					onFocus={handleFocus}
					type="text"
					value={search}
					placeholder="Search conversation ..."
					className="w-full pl-2 py-2 pr-10 border-t border-b h-10 outline-none focus:border-primary"
					onChange={handleChange}
				/>
				<span className="absolute top-[0.5rem] right-4">
					{isLoading ? (
						<span className="w-6 h-6 border-4 border-t-transparent border-primary rounded-full inline-block animate-spin"></span>
					) : (
						<XIcon
							onClick={() => {
								setRoomSearch([]);
								setSearch("");
							}}
							className="w-6 h-6 text-gray-300"
						/>
					)}
				</span>
			</div>
			{roomSearch?.length > 0 && (
				<div className="w-full h-fit max-h-96 overflow-y-auto bg-white py-2 z-10 absolute top-[3rem] left-0 shadow-md">
					{roomSearch?.length > 0 && (
						<div>
							<p className="font-bold my-2">Chats:</p>
							{roomSearch?.map((room) => {
								return (
									<div
										onClick={() => {
											handleChooseChat(room);
										}}
										className="w-full flex items-center mb-2 py-1 px-1 hover:bg-gray-100 rounded-sm cursor-pointer"
										key={room._id}
									>
										<span className="h-8 w-8 mr-4 relative rounded-full bg-bg1">
											<Avatar userId={room.userId} />
										</span>
										<span className="max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
											{room.name}
										</span>
									</div>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchRooms;
