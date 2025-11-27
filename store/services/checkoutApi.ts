/* eslint-disable @typescript-eslint/no-explicit-any */

import mainApi from "./mainApi";

export const checkoutAPi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		createOrder: builder.mutation({
			query: ({ storeId, body }) => ({
				url: `orders?storeId=${storeId}`,
				method: 'POST',
				body: body,
			}),
			invalidatesTags: ['order'],
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
	}),
});

export const {
	useCreateOrderMutation,
	useVerifyCouponMutation,
	useCartTotalsMutation,
} = checkoutAPi;
