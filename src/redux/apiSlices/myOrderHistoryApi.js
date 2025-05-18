import { api } from "../api/baseApi";



const commissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all commissions
    getMyorderHistory: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }

        return {
          url: `/sales/orders/my-order`,
          method: "GET",
          params,
        };
      },
    }),

    // Get single commission details by ID
    getCommissionAnalysis: builder.query({
      query: () => ({
        url: `/sales/commission`,
        method: "GET",
      }),
    }),

  
  }),
});

export const {
  useGetMyorderHistoryQuery,
  useGetCommissionAnalysisQuery,
} = commissionApi;
