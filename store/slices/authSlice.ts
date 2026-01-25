import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { storage } from '@/utils/storage';

type AuthStateType = {
	token: string | null;
	loggedIn: boolean;
	user: any;
	refreshToken: string | null;
};

type LoginPayloadType = {
	token: string;
	refreshToken?: string;
	user: any;
};

const TOKEN_NAME = 'TOKEN_NAME';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

// Define the initial state
const initialState: AuthStateType = {
	token: '',
	loggedIn: false,
	user: '',
	refreshToken: null,
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
				storage.removeItemSync('hasSelectedArea');
				storage.removeItemSync('selectedCity');
				storage.removeItemSync('selectedArea');
			} else {
				SecureStore.deleteItemAsync(TOKEN_NAME).catch(console.error);
				SecureStore.deleteItemAsync(REFRESH_TOKEN).catch(console.error);
				storage.removeItem('hasSelectedArea').catch(console.error);
				storage.removeItem('selectedCity').catch(console.error);
				storage.removeItem('selectedArea').catch(console.error);
			}

			state.token = null;
			state.loggedIn = false;
		},
		login: (state, action: PayloadAction<LoginPayloadType>): void => {
			const { token, refreshToken, user }: LoginPayloadType = action.payload;
			state.token = token;
			state.refreshToken = refreshToken || null;
			state.user = user || null;
			state.loggedIn = true;

			// Store tokens securely on native, localStorage on web
			if (Platform.OS === 'web') {
				storage.setItemSync(TOKEN_NAME, token);
				if (refreshToken) storage.setItemSync(REFRESH_TOKEN, refreshToken);
				if (user) storage.setItemSync('auth_user', JSON.stringify(user));
			} else {
				SecureStore.setItemAsync(TOKEN_NAME, token).catch(console.error);
				if (refreshToken)
					SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken).catch(console.error);
				if (user) SecureStore.setItemAsync('auth_user', JSON.stringify(user)).catch(console.error);
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
		setUser: (state, action: PayloadAction<any>): void => {
			state.user = action.payload;

			if (Platform.OS === 'web') {
				storage.setItemSync('auth_user', JSON.stringify(action.payload));
			} else {
				SecureStore.setItemAsync('auth_user', JSON.stringify(action.payload)).catch(console.error);
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

export const { login, logout, refresh: refreshAuth, hydrateAuth } = authSlice.actions;

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
