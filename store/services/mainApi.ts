import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL } from '../constants';

const tags = [
	'brand',
	'brands',
	'category',
	'categories',
	'collection',
	'collections',
	'count',
	'coupon',
	'coupons',
	'filter',
	'filters',
	'organizations',
	'product',
	'products',
	'role',
	'roles',
	'scan',
	'self',
	'sum',
	'tag',
	'tags',
	'upload',
	'uploads',
	'user',
	'users',
	'user-api/orders',
	'user-api/categories',
	'user-api/products',
	'/categorys',
	'categorys',
];

// src/store/types.ts
export interface AuthState {
	// token: string | null;
}

export interface RootState {
	auth: AuthState;
	// other slices of state
}

export const token = process.env.EXPO_PUBLIC_TOKEN;

export const mainApi = createApi({
	reducerPath: 'mainApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${URL.api}/api`,
		prepareHeaders: (headers: any, { getState }: any) => {
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers; // ✅ IMPORTANT
		},
	}),
	tagTypes: tags,
	endpoints: () => ({}),
});

export default mainApi;
