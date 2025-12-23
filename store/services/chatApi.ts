import mainApi from './mainApi';

export const chatApi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		getChatsByCustomer: builder.query<any, string>({
			query: customerId => `chats/customer/${customerId}`,
			providesTags: ['chats'],
		}),

		getChatById: builder.query<any, string>({
			query: id => `chats/${id}`,
			providesTags: (result, error, id) => [{ type: 'chats', id }],
		}),

		createChat: builder.mutation<
			any,
			{
				customerId: string;
				subject: string;
				firstMessage: string;
				priority?: string;
			}
		>({
			query: body => ({
				url: 'chats',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['chats'],
		}),

		getMessagesByChatId: builder.query<any, string>({
			query: chatId => `messages/chat/${chatId}`,
			providesTags: (result, error, chatId) => [
				{ type: 'messages', id: chatId },
			],
		}),

		sendMessage: builder.mutation<
			any,
			{
				chatId: string;
				content: string;
				senderType: 'customer' | 'agent';
				senderId: string;
			}
		>({
			query: body => ({
				url: 'messages',
				method: 'POST',
				body,
			}),
			invalidatesTags: (result, error, { chatId }) => [
				{ type: 'messages', id: chatId },
				'chats',
			],
		}),

		markAllMessagesAsRead: builder.mutation<any, string>({
			query: chatId => ({
				url: `messages/chat/${chatId}/read-all`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, chatId) => [
				{ type: 'messages', id: chatId },
			],
		}),
	}),
});

export const {
	useGetChatsByCustomerQuery,
	useGetChatByIdQuery,
	useCreateChatMutation,
	useGetMessagesByChatIdQuery,
	useSendMessageMutation,
	useMarkAllMessagesAsReadMutation,
} = chatApi;
