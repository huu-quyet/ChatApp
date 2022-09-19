import React from "react";
import { UserIcon, XIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";

type TProps = {
	handleCancelCreateRoom: () => void;
};

const NewRoom = ({ handleCancelCreateRoom }: TProps): JSX.Element => {
	const { usersSelected } = useSelector((state: RootState) => state.chats);

	const getName = () => {
		const name = usersSelected
			?.reduce((pre, cur) => {
				return pre + cur?.userName + ", ";
			}, "")
			.trim();
		return name.slice(0, name.length - 1);
	};

	return (
		<div
			className={`w-full bg-gray-100 px-2 py-2 flex items-center relative rounded-sm cursor-pointer 
    }`}
		>
			<span className="h-12 w-12 rounded-full bg-primary mr-4 relative">
				<UserIcon className="h-6 w-6 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
			</span>
			<span className="font-bold max-w-[60%]">
				{usersSelected?.length > 0 ? (
					<span className="w-full block text-ellipsis overflow-hidden whitespace-nowrap">
						Chat with: {getName()}
					</span>
				) : (
					<span>New chat</span>
				)}
			</span>
			<XIcon
				onClick={handleCancelCreateRoom}
				className="h-6 w-6 absolute top-1/2 right-8 translate-y-[-50%]"
			/>
		</div>
	);
};

export default NewRoom;
