import { api } from "../api/baseApi";


const commissionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all commissions
    getCommissions: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }

        return {
          url: `/sales/commission/order`,
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
  useGetCommissionsQuery,
  useGetCommissionAnalysisQuery,
} = commissionApi;
