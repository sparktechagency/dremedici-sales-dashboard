import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://10.10.7.37:5003/api/v1",
    baseUrl: "https://api.elmagocigarsapp.com/api/v1",
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token = localStorage.getItem("accessToken");

      // If we have a token, set the authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Categories",
    "category",
    "Home",
    "Inventory",
    "LoyaltyManagement",
    "Orders",
    "Retailers",
    "Commissions",
    "SalesRep",
    "Settings",
    "Subscriptions",
    "SubscriptionUser",
  ],
  endpoints: () => ({}),
});

// export const imageUrl = "http://10.10.7.37:5003";
export const imageUrl = "https://api.elmagocigarsapp.com";
