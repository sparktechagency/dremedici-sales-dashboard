import { api } from "../api/baseApi";

const homeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    summary: builder.query({
      query: () => {
        return {
          url: `/retailer/dashboard/summary`,
          method: "GET",
        };
      },
    }),
    getProducts: builder.query({
        query: (args) => {
               const params = new URLSearchParams();

               if (args) {
                 args.forEach((arg) => {
                   params.append(arg.name, arg.value);
                 });
               }
        return {
          url: `/retailer/dashboard/get-products`,
          method: "GET",
          params,
        };
      },
    }),

    getRetailer: builder.query({
      query: () => {
        return {
          url: `/sales/dashboard/my-retailers`,
          method: "GET",
        };
      },
    }),
    createOrderProduct: builder.mutation({
      query: (data) => {
        return {
          url: `/retailer/dashboard/create`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useSummaryQuery, useGetProductsQuery,useGetRetailerQuery, useCreateOrderProductMutation } =
  homeSlice;
