import { api } from "../api/baseApi";

const retailerManagementApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRetailers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }

        return {
          url: `/sales/dashboard/my-retailers-details`,
          method: "GET",
          params,
        };
      },
    }),

    // Get single commission details by ID
    geAllSubscription: builder.query({
      query: () => ({
        url: `/retailer/subscription`,
        method: "GET",
      }),
    }),
    retailerSubscribedPackage: builder.query({
      query: (id) => ({
        url: `/retailer/subscription/subscription/${id}`,
        method: "GET",
      }),
    }),
    addExtraBoxes: builder.mutation({
      query: ({ id, data }) => ({
        url: `/retailer/subscription/update-boxes/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    updateSubscribedPackage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/retailer/subscription/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags:["RetailerManagement"]
    }),

    updateSubscription: builder.mutation({
      query: ({ id, body }) => {
        return {
          method: "PATCH",
          url: `/retailer/subscription/update/${id}`,
          body: body,
        };
      },
      invalidatesTags:["RetailerManagement"]
    }),
  }),
});

export const {
  useGetAllRetailersQuery,
  useGeAllSubscriptionQuery,
  useRetailerSubscribedPackageQuery,
  useAddExtraBoxesMutation,
  useUpdateSubscribedPackageMutation,
  useUpdateSubscriptionMutation,
} = retailerManagementApi;
