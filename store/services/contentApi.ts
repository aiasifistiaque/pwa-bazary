import mainApi from './mainApi';

export const contentApi = mainApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getContents: builder.query({
      query: () => ({
        url: `/api/contents/mango`,
      }),

    }),
  }),
});

export const { useGetContentsQuery } = contentApi;
