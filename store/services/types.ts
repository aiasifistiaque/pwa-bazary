export type LoginPayloadType = {
	token: string;
	refreshToken?: string;
	user?: any;
};

export type LoginBodyType = {
	email: string;
	password: string;
};
