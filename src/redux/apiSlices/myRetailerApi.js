import { api } from "../api/baseApi";

const myRetailerSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createRetailer: builder.mutation({
      query: (retailerData) => {
        return {
          url: "/admin/retailer/managment/create",
          method: "POST",
          body: retailerData,
          formData: true,
        };
      },
      invalidatesTags: ["Retailers"],
    }),

    // Get all retailers
    getRetailers: builder.query({
      query: () => ({
        url: "/sales/dashboard/my-retailers",
        method: "GET",
      }),
      providesTags: ["Retailer"],
    }),

    // Get single retailer by ID
    getRetailerById: builder.query({
      query: (id) => ({
        url: `/sales/dashboard/my-retailer/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Retailer", id }],
    }),

    // Get single retailer by ID
    getRetailerDetailsInfo: builder.query({
      query: (id) => ({
        url: `/sales/dashboard/my-retailer/details/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Retailer", id }],
    }),

    RetailerDetailsAnalysis: builder.query({
      query: (id) => ({
        url: `/sales/dashboard/my-retailer/details/analysis/${id}`,
        method: "GET",
      }),
      //   transformResponse: (response) => response.data,
      providesTags: ["Retailer"],
    }),

    getRetailerMyOrder: builder.query({
      query: (id) => ({
        url: `/sales/dashboard/my-retailer/details/orders/${id}`,
        method: "GET",
      }),
      //   transformResponse: (response) => response.data,
      providesTags: ["Retailer"],
    }),

    getMyRetailerOrderDetails: builder.query({
      query: (id) => ({
        url: `/sales/dashboard/my-retailer/details/order/${id}`,
        method: "GET",
      }),
      //   transformResponse: (response) => response.data,
      providesTags: ["Retailer"],
    }),

    // Create new retailer
    // createRetailer: builder.mutation({
    //   query: (data) => ({
    //     url: "/retailer",
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: [{ type: "Retailer", id: "LIST" }],
    // }),

    // Edit/update retailer by ID
    updateRetailerInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sales/dashboard/my-retailer/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Retailer", id }],
    }),

    // Delete retailer by ID
    deleteRetailer: builder.mutation({
      query: (id) => ({
        url: `/retailer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Retailer", id },
        { type: "Retailer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRetailersQuery,
    useGetRetailerByIdQuery,
  useRetailerDetailsAnalysisQuery,
  useGetRetailerMyOrderQuery,
  useGetRetailerDetailsInfoQuery,
  useGetMyRetailerOrderDetailsQuery,
  // useCreateRetailerMutation,
  useUpdateRetailerInfoMutation,
  useDeleteRetailerMutation,
  useCreateRetailerMutation
} = myRetailerSlice;
