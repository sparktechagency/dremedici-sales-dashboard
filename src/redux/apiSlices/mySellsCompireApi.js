import { api } from "../api/baseApi";

const mySellsCompireApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all commissions
    mySellsCompire: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }

        return {
          url: `/sales/my-sales`,
          method: "GET",
          params,
        };
      },
      providesTags: ["MySellsCompire"], // Cache tag for sales comparison data
    }),

    // Get single commission details by ID
    getCommissionAnalysis: builder.query({
      query: () => ({
        url: `/sales/commission`,
        method: "GET",
      }),
      providesTags: ["CommissionAnalysis"], // Cache tag for commission analysis data
    }),
  }),
});

export const {
  useMySellsCompireQuery,
  useGetCommissionAnalysisQuery,
} = mySellsCompireApi;
