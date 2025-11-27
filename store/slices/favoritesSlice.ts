import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { storage } from '@/utils/storage';

const FAVORITES_KEY = 'favorites';

export interface FavoriteItem {
	id: string;
	name: string;
	price: number;
	image: string;
	unit?: string;
	unitPrice?: string;
}

interface FavoritesState {
	items: FavoriteItem[];
}

const initialState: FavoritesState = {
	items: [],
};

export const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		addToFavorites: (state, action: PayloadAction<FavoriteItem>) => {
			const exists = state.items.some(item => item.id === action.payload.id);
			if (!exists) {
				state.items.push(action.payload);
				saveFavorites(state.items);
			}
		},
		removeFromFavorites: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(item => item.id !== action.payload);
			saveFavorites(state.items);
		},
		toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
			const index = state.items.findIndex(
				item => item.id === action.payload.id
			);
			if (index >= 0) {
				state.items.splice(index, 1);
			} else {
				state.items.push(action.payload);
			}
			saveFavorites(state.items);
		},
		setFavorites: (state, action: PayloadAction<FavoriteItem[]>) => {
			state.items = action.payload;
		},
	},
});

const saveFavorites = async (items: FavoriteItem[]) => {
	try {
		const jsonValue = JSON.stringify(items);
		if (Platform.OS === 'web') {
			storage.setItemSync(FAVORITES_KEY, jsonValue);
		} else {
			await storage.setItem(FAVORITES_KEY, jsonValue);
		}
	} catch (e) {
		console.error('Failed to save favorites:', e);
	}
};

export const loadFavorites = async () => {
	try {
		let jsonValue;
		if (Platform.OS === 'web') {
			jsonValue = storage.getItemSync(FAVORITES_KEY);
		} else {
			jsonValue = await storage.getItem(FAVORITES_KEY);
		}
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	} catch (e) {
		console.error('Failed to load favorites:', e);
		return [];
	}
};

export const {
	addToFavorites,
	removeFromFavorites,
	toggleFavorite,
	setFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
