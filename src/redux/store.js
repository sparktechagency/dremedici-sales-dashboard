import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/baseApi";
import { subscriptionApi } from "./apiSlices/subscriptionSlice";

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware, subscriptionApi.middleware),
});

export default store;