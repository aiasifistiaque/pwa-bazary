import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthStateType = {
	token: string | null;
	loggedIn: boolean;
};

type LoginPayloadType = {
	token: string;
	refreshToken?: string;
};

// Define the initial state
const initialState: AuthStateType = {
	token: '',
	loggedIn: false,
};
export const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		logout: (state): void => {
			// localStorage.setItem(TOKEN_NAME, 'null');
			// localStorage.setItem(REFRESH_TOKEN, 'null');
			state.token = null;
			state.loggedIn = false;
			// window.location.reload();
			void (document.location.href = '/login');
		},
		login: (state, action: PayloadAction<LoginPayloadType>): void => {
			const { token }: LoginPayloadType = action.payload;
			state.token = token;
			state.loggedIn = true;
			// localStorage.setItem(TOKEN_NAME, token);
			// localStorage.setItem(REFRESH_TOKEN, refreshToken);
			// window.location.reload();
			void (document.location.href = '/user-profile');
		},
		refresh: (state, action: PayloadAction<string>): void => {
			// localStorage.setItem(TOKEN_NAME, action.payload);
			state.token = action.payload;
			state.loggedIn = true;
		},
	},
});

export const { login, logout, refresh: refreshAuth } = authSlice.actions;

export default authSlice.reducer;
