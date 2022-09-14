/* eslint-disable indent */
import { UserIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../common/store/store";
import { loginActions } from "../../login/redux/reducer";
import {
	addFriend,
	getUserInfoById,
	rejectAddFriend,
	unfriend,
} from "../redux/service";
import lodash from "lodash";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../chat/utils/types";
import socket, { EVENTS } from "../../../utils/socket";

const UserInfo = (): JSX.Element => {
	const { userSelected } = useSelector((state: RootState) => state.friends);

	const [userInfo, setUserInfo] = useState<IUser>();

	const { user } = useSelector((state: RootState) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (userSelected) {
			getUserInfoById(userSelected).then((res) => {
				if (res.data.status === "success") {
					setUserInfo(res.data.user);
				}
			});
			navigate(`/friends/${userSelected}`, { replace: true });
		} else {
			navigate("/friends", { replace: true });
		}
	}, [userSelected]);

	const checkIsFriend = () => {
		if (user?.friends?.find((item: string) => item === userInfo?._id)) {
			return true;
		}

		return false;
	};

	const checkIsWaitingApproval = () => {
		if (user?.waitingApproval?.find((item: string) => item === userInfo?._id)) {
			return true;
		}

		return false;
	};

	const checkIsSendedRequire = () => {
		if (user?.sendedRequire?.find((item: string) => item === userInfo?._id)) {
			return true;
		}

		return false;
	};

	const handleUnfriend = lodash.debounce((id: string) => {
		unfriend(id)
			.then((res) => {
				if (res.data.status === "success") {
					dispatch(dispatch(loginActions.updateActiveStatus(res.data.data.user)));
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, 300);

	const handleSendRequireAddFriend = lodash.debounce((id: string) => {
		if (user?.sendedRequire?.includes(id)) {
			return;
		}
		socket.emit(
			EVENTS.CLIENT.SEND_REQUIRE,
			{ sender: user._id, to: id },
			(response: any) => {
				dispatch(loginActions.updateActiveStatus(response.senderInfo));
			}
		);
	}, 300);

	const handleAccept = lodash.debounce(() => {
		if (userInfo?._id)
			addFriend(userInfo._id)
				.then((res) => {
					if (res.data.status === "success") {
						dispatch(loginActions.updateActiveStatus(res.data.data.user));
					}
				})
				.catch((err) => {
					console.log(err);
				});
	}, 500);

	const handleReject = lodash.debounce(() => {
		if (userInfo?._id)
			rejectAddFriend(userInfo._id)
				.then((res) => {
					if (res.data.status === "success") {
						dispatch(loginActions.updateActiveStatus(res.data.data.user));
					}
				})
				.catch((err) => {
					console.log(err);
				});
	}, 500);

	return (
		<div className="h-screen flex-grow -ml-8 relative border-l bg-gray-100">
			<div className="w-full h-full">
				{userInfo?._id && (
					<>
						{!userInfo?.avatar ? (
							<div className="w-16 h-16 m-auto mt-12 mb-2 rounded-full bg-gray-300 relative">
								<UserIcon className="w-8 h-8 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
							</div>
						) : (
							<img
								className="w-16 h-16 rounded-full object-cover m-auto mt-12 mb-2"
								src={userInfo?.avatar}
							/>
						)}
						<h2 className="m-auto font-bold text-center max-w-xs whitespace-nowrap text-ellipsis overflow-hidden">
							{userInfo?.userName}
						</h2>
						<div className="m-auto flex justify-center mt-4">
							{!checkIsFriend() &&
								!checkIsWaitingApproval() &&
								!checkIsSendedRequire() && (
									<span
										onClick={() => {
											handleSendRequireAddFriend(userInfo?._id);
										}}
										className="px-2 py-1 w-28 inline-block text-center border-primary border-2 rounded-lg bg-secondary shadow-xl cursor-pointer"
									>
										Add Friend
									</span>
								)}
							{checkIsFriend() && (
								<span
									onClick={() => {
										handleUnfriend(userInfo?._id);
									}}
									className="px-2 py-1 w-28 inline-block text-center bg-red-500 border-primary border-2 rounded-lg shadow-xl cursor-pointer"
								>
									UnFriend
								</span>
							)}
							{!checkIsFriend() &&
								!checkIsWaitingApproval() &&
								checkIsSendedRequire() && (
									<span className="px-2 py-1 mr-4 w-36 inline-block text-center border-primary border-2 rounded-lg bg-bg2 shadow-xl cursor-not-allowed">
										Waiting Accept
									</span>
								)}
							{!checkIsFriend() && checkIsWaitingApproval() && (
								<div>
									<span
										onClick={handleAccept}
										className="px-2 py-1 mr-4 w-28 inline-block text-center border-primary border-2 rounded-lg bg-secondary shadow-xl cursor-pointer"
									>
										Accept
									</span>
									<span
										onClick={handleReject}
										className="px-2 py-1 w-28 inline-block text-center bg-red-500 border-primary border-2 rounded-lg shadow-xl cursor-pointer"
									>
										Reject
									</span>
								</div>
							)}
						</div>
						<div>
							{userInfo?.firstName && <span>First name: {userInfo?.firstName}</span>}
							{userInfo?.lastName && <span>First name: {userInfo?.lastName}</span>}
							{userInfo?.birthday && <span>First name: {userInfo?.birthday}</span>}
							{userInfo?.phone && <span>First name: {userInfo?.phone}</span>}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default UserInfo;
