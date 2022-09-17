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
	const { user } = useSelector((state: RootState) => state.auth);

	const [userInfo, setUserInfo] = useState<IUser>();
	const [isLoading, setIsLoading] = useState(false);
	const [loadingUnfriend, setLoadingUnfriend] = useState(false);
	const [loadingAddFriend, setLoadingAddFriend] = useState(false);
	const [loadingReject, setLoadingReject] = useState(false);
	const [loadingAccept, setLoadingAccept] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (userSelected) {
			setIsLoading(true);
			getUserInfoById(userSelected)
				.then((res) => {
					if (res.data.status === "success") {
						setUserInfo(res.data.user);
						setIsLoading(false);
					}
				})
				.catch(() => {
					setIsLoading(false);
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
		if (!loadingUnfriend) {
			setLoadingUnfriend(true);
			unfriend(id)
				.then((res) => {
					if (res.data.status === "success") {
						dispatch(dispatch(loginActions.updateActiveStatus(res.data.data.user)));
						setLoadingUnfriend(false);
					}
				})
				.catch(() => {
					setLoadingUnfriend(false);
				});
		}
	}, 300);

	const handleSendRequireAddFriend = lodash.debounce((id: string) => {
		if (user?.sendedRequire?.includes(id) && !loadingAddFriend) {
			return;
		}
		setLoadingAddFriend(true);
		socket.emit(
			EVENTS.CLIENT.SEND_REQUIRE,
			{ sender: user._id, to: id },
			(response: any) => {
				dispatch(loginActions.updateActiveStatus(response.senderInfo));
				setLoadingAddFriend(false);
			}
		);
	}, 300);

	const handleAccept = lodash.debounce(() => {
		if (userInfo?._id && !loadingAccept && !loadingReject) {
			setLoadingAccept(true);
			addFriend(userInfo._id)
				.then((res) => {
					if (res.data.status === "success") {
						dispatch(loginActions.updateActiveStatus(res.data.data.user));
						setLoadingAccept(false);
					}
				})
				.catch(() => {
					setLoadingAccept(false);
				});
		}
	}, 500);

	const handleReject = lodash.debounce(() => {
		if (userInfo?._id && !loadingReject && !loadingAccept) {
			setLoadingReject(true);
			rejectAddFriend(userInfo._id)
				.then((res) => {
					if (res.data.status === "success") {
						dispatch(loginActions.updateActiveStatus(res.data.data.user));
						setLoadingReject(false);
					}
				})
				.catch(() => {
					setLoadingReject(false);
				});
		}
	}, 500);

	return (
		<div className="h-screen flex-grow -ml-8 relative border-l bg-gray-100">
			{isLoading ? (
				<div className="h-screen bg-gray-300 relative z-10">
					<span className="w-8 h-8 animate-spin border-4 border-primary relative top-1/2 left-1/2 rounded-t-full rounded-b-full border-l-transparent inline-block z-20"></span>
				</div>
			) : (
				<>
					{userInfo?._id && (
						<div className="w-1/3 h-1/2 component-center bg-primary rounded-lg shadow-2xl">
							<div className="w-16 h-16 rounded-full border-2 border-white outline-2 m-auto mt-16 mb-2 relative shadow-xl">
								{!userInfo?.avatar ? (
									<UserIcon className="w-8 h-8 text-white component-center" />
								) : (
									<img
										className="w-14 h-14 rounded-full component-center object-cover m-auto"
										src={userInfo?.avatar}
									/>
								)}
							</div>
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
											{loadingAddFriend ? (
												<span className="w-4 h-4 mt-1 rounded-full border-4 border-primary animate-spin inline-block border-l-transparent" />
											) : (
												<span>Add Friend</span>
											)}
										</span>
									)}
								{checkIsFriend() && (
									<span
										onClick={() => {
											handleUnfriend(userInfo?._id);
										}}
										className="px-2 py-1 w-28 inline-block text-center bg-red-500 border-primary border-2 rounded-lg shadow-xl cursor-pointer"
									>
										{loadingUnfriend ? (
											<span className="w-4 h-4 mt-1 rounded-full border-4 border-primary animate-spin inline-block border-l-transparent" />
										) : (
											<span>Unfriend</span>
										)}
									</span>
								)}
								{!checkIsFriend() &&
									!checkIsWaitingApproval() &&
									checkIsSendedRequire() && (
										<span className="px-2 py-1 mr-4 w-36 inline-block text-center border-2 rounded-lg bg-bg2 shadow-xl cursor-not-allowed">
											<span>Waiting Accept</span>
										</span>
									)}
								{!checkIsFriend() && checkIsWaitingApproval() && (
									<div>
										<span
											onClick={handleAccept}
											className="px-2 py-1 mr-4 w-28 inline-block text-center border-primary border-2 rounded-lg bg-secondary shadow-xl cursor-pointer"
										>
											{loadingAccept ? (
												<span className="w-4 h-4 mt-1 rounded-full border-4 border-primary animate-spin inline-block border-l-transparent" />
											) : (
												<span>Accept</span>
											)}
										</span>
										<span
											onClick={handleReject}
											className="px-2 py-1 w-28 inline-block text-center bg-red-500 border-primary border-2 rounded-lg shadow-xl cursor-pointer"
										>
											{loadingReject ? (
												<span className="w-4 h-4 mt-1 rounded-full border-4 border-primary animate-spin inline-block border-l-transparent" />
											) : (
												<span>Reject</span>
											)}
										</span>
									</div>
								)}
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default UserInfo;
