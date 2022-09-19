import React from "react";
import { getDateAndTime, TYPE_MESSAGE } from "../utils/function";
import { IMessage } from "../utils/types";

type TProps = {
	m: IMessage;
};

const Message = ({ m }: TProps): JSX.Element => {
	const checkMesBelongUser = (mes: IMessage) => {
		let check = false;
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			if (mes.sender?._id.toString() === JSON.parse(userInfo)._id) {
				check = true;
			} else {
				check = false;
			}
		}

		return check;
	};

	return (
		<>
			{checkMesBelongUser(m) ? (
				<div className="flex items-center justify-end px-2">
					<span
						className={`${
							m.type === TYPE_MESSAGE.IMG && m.path ? "bg-white" : "bg-secondary"
						} max-w-[50%] break-words px-2 py-1 inline-block bg-opacity-70 rounded-lg tooltip`}
					>
						{m.type === TYPE_MESSAGE.TEXT && <p>{m.content}</p>}
						{m.type === TYPE_MESSAGE.IMG && m.path && (
							<img className="max-w-full max-h-96" src={m.path} />
						)}
						<span className="tooltip_text right-0">{getDateAndTime(m.sendedAt)}</span>
					</span>
					<span className="mx-2 tooltip">
						<img className="w-6 h-6 rounded-full" src={m.sender?.avatar} />
						<span className="tooltip_text right-[12px]">{m.sender?.userName}</span>
					</span>
				</div>
			) : (
				<div className="flex items-center px-2">
					<span className="mr-2 tooltip">
						<img className="w-6 h-6 rounded-full" src={m.sender?.avatar} />
						<span className="tooltip_text">{m.sender?.userName}</span>
					</span>
					<span className="max-w-[50%] break-words px-2 py-1 inline-block bg-white rounded-lg tooltip">
						{m.type === TYPE_MESSAGE.TEXT && <p>{m.content}</p>}
						{m.type === TYPE_MESSAGE.IMG && m.path && (
							<img className="max-w-full max-h-96" src={m.path} />
						)}
						<span className="tooltip_text">{getDateAndTime(m.sendedAt)}</span>
					</span>
				</div>
			)}
		</>
	);
};

export default Message;
