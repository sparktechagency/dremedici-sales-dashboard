import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.7.37:5003/api/v1",
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
  tagTypes: ['Subscription', 'SubscriptionBox'],
  endpoints: (builder) => ({
    // Retailer Subscription Management
    getRetailerSubscriptions: builder.query({
      query: () => '/subscriptions/retailers',
      providesTags: ['Subscription'],
    }),
    
    createRetailerSubscription: builder.mutation({
      query: (data) => ({
        url: '/subscriptions/retailers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    
    updateRetailerSubscription: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscriptions/retailers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    
    deleteRetailerSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscriptions/retailers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Subscription Box Management
    getSubscriptionBoxes: builder.query({
      query: () => '/subscriptions/boxes',
      providesTags: ['SubscriptionBox'],
    }),
    
    createSubscriptionBox: builder.mutation({
      query: (data) => ({
        url: '/subscriptions/boxes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SubscriptionBox'],
    }),
    
    updateSubscriptionBox: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/subscriptions/boxes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['SubscriptionBox'],
    }),
    
    deleteSubscriptionBox: builder.mutation({
      query: (id) => ({
        url: `/subscriptions/boxes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubscriptionBox'],
    }),

    // Get subscription by ID
    getSubscriptionById: builder.query({
      query: (id) => `/subscriptions/${id}`,
      providesTags: ['Subscription'],
    }),

    // Get subscription box by ID
    getSubscriptionBoxById: builder.query({
      query: (id) => `/subscriptions/boxes/${id}`,
      providesTags: ['SubscriptionBox'],
    }),
  }),
});

export const {
  useGetRetailerSubscriptionsQuery,
  useCreateRetailerSubscriptionMutation,
  useUpdateRetailerSubscriptionMutation,
  useDeleteRetailerSubscriptionMutation,
  useGetSubscriptionBoxesQuery,
  useCreateSubscriptionBoxMutation,
  useUpdateSubscriptionBoxMutation,
  useDeleteSubscriptionBoxMutation,
  useGetSubscriptionByIdQuery,
  useGetSubscriptionBoxByIdQuery,
} = subscriptionApi;
