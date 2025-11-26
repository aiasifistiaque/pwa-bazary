// import mainApi from './mainApi';
// import { LoginBodyType, LoginPayloadType } from './types';

// export const authApi = mainApi.injectEndpoints({
// 	endpoints: builder => ({
// 		login: builder.mutation<LoginPayloadType, LoginBodyType>({
// 			query: ({ email, password }) => ({
// 				url: `auth/login`,
// 				method: 'POST',
// 				body: {
// 					email,
// 					password,
// 				},
// 			}),
// 			invalidatesTags: ['self'],
// 		}),
// 		register: builder.mutation<any, any>({
// 			query: body => ({
// 				url: `auth/register`,
// 				method: 'POST',
// 				body: body,
// 			}),
// 			invalidatesTags: ['self'],
// 		}),
// 		updatePassword: builder.mutation<any, any>({
// 			query: body => ({
// 				url: `auth/change-password`,
// 				method: 'PUT',
// 				body,
// 			}),
// 			invalidatesTags: ['self'],
// 		}),
// 		getSelf: builder.query<any, any>({
// 			query: () => `auth/self`,
// 			providesTags: ['self'],
// 		}),
// 		updateSelf: builder.mutation<any, any>({
// 			query: body => ({
// 				url: `auth/self`,
// 				method: 'PUT',
// 				body,
// 			}),
// 			invalidatesTags: ['self'],
// 		}),
// 		updatePreferences: builder.mutation<any, any>({
// 			query: ({ field, preferences }) => ({
// 				url: `auth/update/preferences`,
// 				method: 'PUT',
// 				body: { field, preferences },
// 			}),
// 			invalidatesTags: (result, error, { field, preferences }) => [
// 				field,
// 				'self',
// 			],
// 		}),
// 		updatePassord: builder.mutation<any, any>({
// 			query: ({ field, preferences }) => ({
// 				url: `auth/update/password`,
// 				method: 'PUT',
// 				body: { field, preferences },
// 			}),
// 			invalidatesTags: (result, error, { field, preferences }) => [
// 				field,
// 				'self',
// 			],
// 		}),

// 		requestPasswordChange: builder.mutation({
// 			query: ({ email }) => ({
// 				url: `auth/request-password-change`,
// 				method: 'POST',
// 				body: {
// 					email,
// 				},
// 			}),
// 		}),
// 		verifyToken: builder.query({
// 			query: ({ token }) => ({
// 				url: `auth/verify-reset-token/${token}`,
// 				method: 'GET',
// 			}),
// 		}),
// 		resetPassword: builder.mutation({
// 			query: ({ token, password }) => ({
// 				url: `auth/reset`,
// 				method: 'POST',
// 				body: {
// 					token,
// 					password,
// 				},
// 			}),
// 		}),
// 	}),
// 	overrideExisting: false,
// });

// export const {
// 	useLoginMutation,
// 	useGetSelfQuery,
// 	useUpdatePreferencesMutation,
// 	useRegisterMutation,
// 	useUpdatePasswordMutation,
// 	useUpdateSelfMutation,
// 	useUpdatePassordMutation,
// 	useRequestPasswordChangeMutation,
// 	useVerifyTokenQuery,
// 	useResetPasswordMutation,
// } = authApi;
// export default authApi;
// import { TOKEN_NAME } from '@/store/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginBodyType, LoginPayloadType } from './types';
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const tags = ['self'];

const TOKEN_NAME = 'bazarey';

// src/store/types.ts
export interface AuthState {
	token: string | null;
}

export interface RootState {
	auth: AuthState;
	// other slices of state
}

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}`,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state?.auth?.token;
			// console.log(token);

			if (token) {
				headers.set('Authorization', `${token}`);
			}
		},
	}),
	tagTypes: tags,
	endpoints: builder => ({
		// ✅ login matches old file (auth/login)
		login: builder.mutation<LoginPayloadType, LoginBodyType>({
			query: ({ email, password }) => ({
				url: `api/auth/login`,
				method: 'POST',
				body: { email, password },
			}),
			invalidatesTags: ['self'],
		}),

		// ✅ register matches old file (auth/register)
		register: builder.mutation<any, any>({
			query: body => ({
				url: `api/auth/register`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['self'],
		}),

		updatePassword: builder.mutation<any, any>({
			query: body => ({
				url: `auth/change-password`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['self'],
		}),
		getSelf: builder.query<any, any>({
			query: () => ({
				url: `user-api/auth/self`,
			}),
			providesTags: ['self'],
		}),
		getMyOrders: builder.query<any, any>({
			query: () => ({
				url: `/api/orders`,
			}),
			providesTags: ['self'],
		}),
		getSingleOrder: builder.query<any, string>({
			query: orderId => ({
				url: `/user-api/orders/${orderId}`,
			}),
			providesTags: ['self'],
		}),
		updateSelf: builder.mutation<any, any>({
			query: body => ({
				url: `/api/auth/self`,
				method: 'PUT',
				body,
			}),
			invalidatesTags: ['self'],
		}),
		placeOrder: builder.mutation<any, any>({
			query: body => ({
				url: `api/orders`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['self'],
		}),
		updatePreferences: builder.mutation<any, any>({
			query: ({ field, preferences }) => ({
				url: `auth/update/preferences`,
				method: 'PUT',
				body: { field, preferences },
			}),
			invalidatesTags: (result, error, { field, preferences }) => [field, 'self'],
		}),
		updatePassord: builder.mutation<any, any>({
			query: ({ field, preferences }) => ({
				url: `auth/update/password`,
				method: 'PUT',
				body: { field, preferences },
			}),
			invalidatesTags: (result, error, { field, preferences }) => [field, 'self'],
		}),

		requestPasswordChange: builder.mutation({
			query: ({ email }) => ({
				url: `auth/request-password-change`, // ✅ unchanged
				method: 'POST',
				body: { email },
			}),
		}),
		verifyToken: builder.query({
			query: ({ token }) => ({
				url: `auth/verify-reset-token/${token}`, // ✅ unchanged
				method: 'GET',
			}),
		}),
		resetPassword: builder.mutation({
			query: ({ token, password }) => ({
				url: `auth/reset`, // ✅ unchanged
				method: 'POST',
				body: { token, password },
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useGetSelfQuery,
	useUpdatePreferencesMutation,
	useRegisterMutation,
	useUpdatePasswordMutation,
	useUpdateSelfMutation,
	useUpdatePassordMutation,
	useRequestPasswordChangeMutation,
	useVerifyTokenQuery,
	useResetPasswordMutation,
	usePlaceOrderMutation,
	useGetMyOrdersQuery,
	useGetSingleOrderQuery,
} = authApi;

export default authApi;
