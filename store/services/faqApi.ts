import { mainApi } from './mainApi';

export const faqApi = mainApi.injectEndpoints({
	endpoints: builder => ({
		getAllFaqs: builder.query<any, any>({
			query: ({
				sort = '-createdAt',
				page = 1,
				limit = 100,
				search = '',
				filters = {},
			} = {}) => ({
				url: '/faqs',
				params: { sort, page, limit, search, ...filters },
			}),
		}),
	}),
});

export const { useGetAllFaqsQuery } = faqApi;
