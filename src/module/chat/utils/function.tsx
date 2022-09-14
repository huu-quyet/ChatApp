/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch } from "@reduxjs/toolkit";
import { chatActions } from "../redux/reducer";
import { IRoom } from "./types";

export const TYPE_MESSAGE = {
	TEXT: "text",
	IMG: "img",
	VIDEO: "video",
	LINK: "link",
	ICON: "icon",
};

export const DAY = {
	0: "Sun",
	1: "Mon",
	2: "Tus",
	3: "Wed",
	4: "Thu",
	5: "Fir",
	6: "Sat",
};

export const checkTypeMes = (mes: string) => {
	const type = TYPE_MESSAGE.TEXT;

	return type;
};

export const getDate = (date: any) => {
	let timeMes = "";
	const newDate = new Date(date);
	const now = new Date(Date.now());

	if (now.getFullYear() < newDate.getFullYear()) {
		timeMes = `${newDate.getDate()}/${
			newDate.getMonth() < 10
				? `0${newDate.getMonth() + 1}`
				: newDate.getMonth() + 1
		}/${newDate.getFullYear()}`;
	} else {
		timeMes = `${newDate.getDate()}/${
			newDate.getMonth() < 10
				? `0${newDate.getMonth() + 1}`
				: newDate.getMonth() + 1
		}`;
	}

	return timeMes;
};

export const getDateAndTime = (date: any) => {
	let timeMes = "";
	const newDate = new Date(date);
	const now = new Date(Date.now());

	if (now.getFullYear() < newDate.getFullYear()) {
		timeMes = `${newDate.getDate()}/${
			newDate.getMonth() < 10
				? `0${newDate.getMonth() + 1}`
				: newDate.getMonth() + 1
		}/${newDate.getFullYear()}, ${newDate.getHours()}:${newDate.getMinutes()}`;
	} else {
		timeMes = `${newDate.getDate()}/${
			newDate.getMonth() < 10
				? `0${newDate.getMonth() + 1}`
				: newDate.getMonth() + 1
		}, ${newDate.getHours()}:${newDate.getMinutes()}`;
	}

	return timeMes;
};

export const updateRoom = (rooms: IRoom[], room: any, dispatch: Dispatch) => {
	const roomFilter = rooms.filter((item) => item._id !== room._id);
	const newRooms = [room, ...roomFilter];
	dispatch(chatActions.updateRoom(newRooms));
};
