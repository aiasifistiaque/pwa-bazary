import { URL } from "../constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tags = [
  "brand",
  "brands",
  "category",
  "categories",
  "collection",
  "collections",
  "count",
  "coupon",
  "coupons",
  "filter",
  "filters",
  "organizatin",
  "organizations",
  "product",
  "products",
  "role",
  "roles",
  "scan",
  "self",
  "sum",
  "tag",
  "tags",
  "upload",
  "uploads",
  "user",
  "users",
];

// src/store/types.ts
export interface AuthState {
  token: string | null;
}

export interface RootState {
  auth: AuthState;
  // other slices of state
}

export const emailSubscriptionApi = createApi({
  reducerPath: "emailSubscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL.api}/api`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token;
      headers.set("store", process.env.NEXT_PUBLIC_STORE || "0001");
      if (token) {
        headers.set("authorization", token);
      }
    },
  }),
  tagTypes: tags,
  endpoints: () => ({}),
});

export default emailSubscriptionApi;



