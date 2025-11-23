import { storage } from '@/utils/storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const WISHLIST_NAME = 'NEXA_WISHLIST';

// Load wishlist from storage
const loadStateFromLocalStorage = (): WishlistState => {
	try {
		const storedState = storage.getItemSync(WISHLIST_NAME);
		return storedState ? JSON.parse(storedState) : { items: [] };
	} catch (error) {
		console.error('Error loading wishlist from storage:', error);
		return { items: [] };
	}
};

// Save wishlist to storage
const saveStateToLocalStorage = (state: WishlistState) => {
	try {
		storage.setItemSync(WISHLIST_NAME, JSON.stringify(state));
	} catch (error) {
		console.error('Error saving wishlist to storage:', error);
	}
};

interface WishlistState {
	items: any[];
}

const initialState: WishlistState = loadStateFromLocalStorage();

export const wishlistSlice = createSlice({
	name: 'wishlist',
	initialState: (() => {
		const stored = storage.getItemSync(WISHLIST_NAME);
		return stored ? JSON.parse(stored) : initialState;
	})(),
	reducers: {
		addToWishlist: (state, action: PayloadAction<any>) => {
			const exists = state.items.some((item: any) => item.id === action.payload.id);
			if (!exists) {
				state.items = [...state.items, action.payload]; // Avoid direct mutation
				saveStateToLocalStorage(state);
			}
		},
		removeFromWishlist: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter((item: any) => item.id !== action.payload);
			saveStateToLocalStorage(state);
		},
		clearWishlist: state => {
			state.items = [];
			saveStateToLocalStorage(state);
		},
	},
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
