import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Address = {
	id: string;
	label: string;
	name: string;
	phone: string;
	street: string;
	area: string;
	city: string;
	postalCode: string;
	isDefault: boolean;
};

type AddressState = {
	addresses: Address[];
	selectedCheckoutAddress: Address | null;
};

const initialState: AddressState = {
	addresses: [
		{
			id: '1',
			label: 'Home',
			name: 'Asif Istiaque',
			phone: '+880 1828398225',
			street: 'House 45, Road 12',
			area: 'Dhanmondi',
			city: 'Dhaka',
			postalCode: '1209',
			isDefault: true,
		},
		{
			id: '2',
			label: 'Office',
			name: 'Asif Istiaque',
			phone: '+880 1828398225',
			street: 'Plot 23, Road 5',
			area: 'Gulshan',
			city: 'Dhaka',
			postalCode: '1212',
			isDefault: false,
		},
	],
	selectedCheckoutAddress: null,
};

const addressSlice = createSlice({
	name: 'address',
	initialState,
	reducers: {
		addAddress: (state, action: PayloadAction<Omit<Address, 'id' | 'isDefault'>>) => {
			const newAddress: Address = {
				...action.payload,
				id: Date.now().toString(),
				isDefault: state.addresses.length === 0,
			};
			state.addresses.push(newAddress);
		},
		updateAddress: (state, action: PayloadAction<Address>) => {
			const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
			if (index !== -1) {
				state.addresses[index] = action.payload;
			}
		},
		deleteAddress: (state, action: PayloadAction<string>) => {
			state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
		},
		setDefaultAddress: (state, action: PayloadAction<string>) => {
			state.addresses = state.addresses.map(addr => ({
				...addr,
				isDefault: addr.id === action.payload,
			}));
		},
		selectCheckoutAddress: (state, action: PayloadAction<Address>) => {
			state.selectedCheckoutAddress = action.payload;
		},
		clearCheckoutAddress: state => {
			state.selectedCheckoutAddress = null;
		},
	},
});

export const {
	addAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
	selectCheckoutAddress,
	clearCheckoutAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
