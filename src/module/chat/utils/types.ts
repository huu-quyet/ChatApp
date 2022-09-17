export interface IRoom {
	createdAt: string;
	id: string;
	message?: number[];
	name: string;
	nickName: { userId: number; name: string }[];
	userId: IUser[];
	__v?: number;
	_id: string;
	lastMessage?: ILastMessage;
	unRead?: string[];
}

export interface IUser {
	_id: string;
	firstName?: string;
	lastName?: string;
	birthday?: string;
	userName: string;
	avatar?: string;
	email: string;
	phone?: string;
	friend?: string[];
	createdAt?: string;
	active?: string;
	online: boolean;
	lastTimeOnline?: string;
	_v?: number;
}

export interface IMessage {
	content: string;
	path: string | null;
	receivedAt: string;
	receiver: string;
	sendedAt: string;
	sender: {
		avatar: string;
		id: string;
		userName: string;
		_id: string;
	};
	type: string;
	__v?: number;
	_id: string;
}

export interface ILastMessage {
	content: string;
	path: any;
	receivedAt: string;
	receiver: string;
	sendedAt: string;
	sender: {
		avatar: string;
		id: string;
		userName: string;
		_id: string;
	};
	type: string;
	__v?: number;
	_id: string;
}

export interface ICurrentRoom {
	createdAt: string;
	id: string;
	name: string;
	nickName: { userId: number; name: string }[];
	userId: IUser[];
	__v?: number;
	_id: string;
	lastMessage?: ILastMessage;
	unRead?: string[];
}
