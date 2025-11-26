import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { storage } from '@/utils/storage';

type AuthStateType = {
	token: string | null;
	loggedIn: boolean;
};

type LoginPayloadType = {
	token: string;
	refreshToken?: string;
};

const TOKEN_NAME = 'TOKEN_NAME';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

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
			// Clear tokens from secure storage (mobile) or localStorage (web)
			if (Platform.OS === 'web') {
				storage.removeItemSync(TOKEN_NAME);
				storage.removeItemSync(REFRESH_TOKEN);
			} else {
				SecureStore.deleteItemAsync(TOKEN_NAME).catch(console.error);
				SecureStore.deleteItemAsync(REFRESH_TOKEN).catch(console.error);
			}

			state.token = null;
			state.loggedIn = false;
		},
		login: (state, action: PayloadAction<LoginPayloadType>): void => {
			const { token, refreshToken }: LoginPayloadType = action.payload;
			state.token = token;
			state.loggedIn = true;

			// Store tokens securely on native, localStorage on web
			if (Platform.OS === 'web') {
				storage.setItemSync(TOKEN_NAME, token);
				if (refreshToken) {
					storage.setItemSync(REFRESH_TOKEN, refreshToken);
				}
			} else {
				SecureStore.setItemAsync(TOKEN_NAME, token).catch(console.error);
				if (refreshToken) {
					SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken).catch(
						console.error
					);
				}
			}
		},
		refresh: (state, action: PayloadAction<string>): void => {
			const token = action.payload;
			state.token = token;
			state.loggedIn = true;

			// Update token in secure storage or localStorage
			if (Platform.OS === 'web') {
				storage.setItemSync(TOKEN_NAME, token);
			} else {
				SecureStore.setItemAsync(TOKEN_NAME, token).catch(console.error);
			}
		},
		// Add action to hydrate auth state from storage
		hydrateAuth: (state, action: PayloadAction<string | null>): void => {
			if (!action.payload) return;
			state.token = action.payload;
			state.loggedIn = true;
		},
	},
});

export const {
	login,
	logout,
	refresh: refreshAuth,
	hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;

// Helper function to load stored token
export const loadStoredToken = async (): Promise<string | null> => {
	try {
		if (Platform.OS === 'web') {
			return storage.getItemSync(TOKEN_NAME);
		}
		const token = await SecureStore.getItemAsync(TOKEN_NAME);
		return token;
	} catch (error) {
		console.error('Failed to load token:', error);
		return null;
	}
};

// Helper function to load stored refresh token
export const loadStoredRefreshToken = async (): Promise<string | null> => {
	try {
		if (Platform.OS === 'web') {
			return storage.getItemSync(REFRESH_TOKEN);
		}
		const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
		return refreshToken;
	} catch (error) {
		console.error('Failed to load refresh token:', error);
		return null;
	}
};
