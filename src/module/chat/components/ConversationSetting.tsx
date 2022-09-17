import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { chatActions } from "../redux/reducer";
import ChangeChatName from "./ChangeChatName";

const ConversationSetting = (): JSX.Element => {
	const [changeChatName, setChangeChatName] = useState(false);

	const dispatch = useDispatch();

	return (
		<section className="w-full h-[90%] absolute top-0 left-0">
			<div
				onClick={() => {
					dispatch(chatActions.setShowPopup(false));
				}}
				className="w-full h-full bg-white bg-opacity-0 z-[9] absolute top-0 left-0 right-0"
			/>
			<div className="w-64 bg-primary absolute top-0 right-0 shadow-lg rounded-md z-10">
				<span
					onClick={() => {
						setChangeChatName(true);
					}}
					className="block px-4 py-2 hover:bg-bg1 hover:cursor-alias"
				>
					Change chat name
				</span>
				<span className="block px-4 py-2 hover:bg-bg1 hover:cursor-not-allowed">
					+ Add members
				</span>
				<span className="block px-4 py-2 hover:bg-bg1 hover:cursor-not-allowed">
					Edit nickname
				</span>
				<span className="block px-4 py-2 hover:bg-bg1 hover:cursor-not-allowed">
					Delete chat
				</span>
			</div>
			{changeChatName ? (
				<ChangeChatName setChangeChatName={setChangeChatName} />
			) : null}
		</section>
	);
};

export default ConversationSetting;
