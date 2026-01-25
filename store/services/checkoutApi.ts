/* eslint-disable @typescript-eslint/no-explicit-any */

import mainApi from './mainApi';

export const checkoutAPi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		createOrder: builder.mutation({
			query: ({ storeId, body }) => ({
				url: `orders?storeId=${storeId}`,
				method: 'POST',
				body: body,
			}),
			invalidatesTags: ['order', 'self', 'Slots'],
		}),

		verifyCoupon: builder.mutation({
			query: ({ storeId, body }) => ({
				url: `orders/verify-coupon?storeId=${storeId}`,
				method: 'POST',
				body: body,
			}),
			invalidatesTags: ['filters'],
		}),
		cartTotals: builder.mutation({
			query: ({ storeId, body }) => ({
				url: `orders/get-cart?storeId=${storeId}`,
				method: 'POST',
				body: body,
			}),
			invalidatesTags: ['cart'],
		}),
		getOrders: builder.query({
			query: ({ storeId, page = 1, limit = 10 }) => ({
				url: `orders?storeId=${storeId}&page=${page}&limit=${limit}`,
				method: 'GET',
			}),
			providesTags: ['order'],
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useVerifyCouponMutation,
	useCartTotalsMutation,
	useGetOrdersQuery,
} = checkoutAPi;
