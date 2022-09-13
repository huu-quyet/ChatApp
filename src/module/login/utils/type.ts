export interface IDataLogin {
	email: string;
	password: string;
}

export interface IDataSignup extends IDataLogin {
	userName: string;
	confirmPassword: string;
}
