import { IconSymbol } from '@/components/ui/icon-symbol';
import {
	useGetChatByIdQuery,
	useGetMessagesByChatIdQuery,
	useSendMessageMutation,
} from '@/store/services/chatApi';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	ActivityIndicator,
} from 'react-native';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useGetSelfQuery } from '@/store/services/authApi';

type Message = {
	_id: string;
	content: string;
	senderType: 'customer' | 'agent' | 'system';
	senderName: string;
	createdAt: string;
	status?: 'sending' | 'sent' | 'failed';
};

export default function ConversationScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: chatData, isLoading: isChatLoading } = useGetChatByIdQuery(
		id as string,
		{ skip: !id }
	);
	const { data: messagesData, isLoading: isMessagesLoading } =
		useGetMessagesByChatIdQuery(id as string, {
			skip: !id,
			pollingInterval: 2000,
		});
	const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
	const { data: user } = useGetSelfQuery({});
	const insets = useSafeAreaInsets();

	const [inputText, setInputText] = useState('');
	const flatListRef = useRef<FlatList>(null);

	const messages = messagesData?.data || [];
	const chat = chatData?.data?.chat || {};

	const handleSend = async () => {
		if (inputText.trim() === '' || !id || !user?._id) return;

		try {
			await sendMessage({
				chatId: id as string,
				content: inputText.trim(),
				senderType: 'customer',
				senderId: user._id,
			}).unwrap();
			setInputText('');
		} catch (error) {
			console.error('Failed to send message:', error);
		}
	};

	const renderMessage = ({ item }: { item: Message }) => {
		const isUser = item.senderType === 'customer';
		const isSystem = item.senderType === 'system';

		if (isSystem) {
			return (
				<View style={styles.systemMessageContainer}>
					<Text style={styles.systemMessageText}>{item.content}</Text>
				</View>
			);
		}

		return (
			<View
				style={[
					styles.messageContainer,
					isUser ? styles.userMessage : styles.agentMessage,
				]}
			>
				{!isUser && (
					<View style={styles.agentAvatar}>
						<IconSymbol name='person.fill' size={20} color='#FFFFFF' />
					</View>
				)}
				<View
					style={[
						styles.messageBubble,
						isUser ? styles.userBubble : styles.agentBubble,
					]}
				>
					<Text
						style={[
							styles.messageText,
							isUser ? styles.userText : styles.agentText,
						]}
					>
						{item.content}
					</Text>
					<Text
						style={[
							styles.timestamp,
							isUser ? styles.userTimestamp : styles.agentTimestamp,
						]}
					>
						{new Date(item.createdAt).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</Text>
				</View>
			</View>
		);
	};

	if (isChatLoading || isMessagesLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='#E63946' />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={0}
			>
				{/* Header */}
				<View style={styles.header}>
					<Pressable onPress={() => router.back()} style={styles.backButton}>
						<IconSymbol name='chevron.left' size={24} color='#000000' />
					</Pressable>
					<View style={styles.headerCenter}>
						<View style={styles.agentInfo}>
							<View style={styles.agentAvatarHeader}>
								<IconSymbol name='person.fill' size={20} color='#FFFFFF' />
							</View>
							<View>
								<Text style={styles.headerTitle}>
									{chat.subject || 'Support'}
								</Text>
								<View style={styles.onlineStatus}>
									<View
										style={[
											styles.onlineDot,
											{
												backgroundColor:
													chat.status === 'ongoing' ? '#10B981' : '#9CA3AF',
											},
										]}
									/>
									<Text
										style={[
											styles.onlineText,
											{
												color:
													chat.status === 'ongoing' ? '#10B981' : '#6B7280',
											},
										]}
									>
										{chat.status || 'Chat'}
									</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={{ width: 40 }} />
				</View>

				{/* Messages List */}
				<FlatList
					ref={flatListRef}
					data={messages}
					renderItem={renderMessage}
					keyExtractor={item => item._id}
					contentContainerStyle={styles.messagesList}
					showsVerticalScrollIndicator={false}
					onContentSizeChange={() =>
						flatListRef.current?.scrollToEnd({ animated: true })
					}
					onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
				/>

				{/* Input Area */}
				<View
					style={[
						styles.inputContainer,
						{ paddingBottom: Math.max(insets.bottom, 12) },
					]}
				>
					<View style={styles.inputWrapper}>
						<TextInput
							style={styles.input}
							placeholder='Type your message...'
							placeholderTextColor='#999999'
							value={inputText}
							onChangeText={setInputText}
							multiline
							maxLength={500}
						/>
						<Pressable
							style={[
								styles.sendButton,
								(inputText.trim() === '' || isSending) &&
									styles.sendButtonDisabled,
							]}
							onPress={handleSend}
							disabled={inputText.trim() === '' || isSending}
						>
							{isSending ? (
								<ActivityIndicator size='small' color='#E63946' />
							) : (
								<IconSymbol
									name='arrow.up.circle.fill'
									size={32}
									color={inputText.trim() === '' ? '#D0D0D0' : '#E63946'}
								/>
							)}
						</Pressable>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerCenter: {
		flex: 1,
		alignItems: 'center',
	},
	agentInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	agentAvatarHeader: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#E63946',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
	},
	onlineStatus: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 2,
	},
	onlineDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	onlineText: {
		fontSize: 12,
		textTransform: 'capitalize',
	},
	messagesList: {
		paddingHorizontal: 16,
		paddingVertical: 20,
	},
	messageContainer: {
		flexDirection: 'row',
		marginBottom: 16,
		alignItems: 'flex-end',
	},
	userMessage: {
		justifyContent: 'flex-end',
	},
	agentMessage: {
		justifyContent: 'flex-start',
	},
	agentAvatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#E63946',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
	},
	messageBubble: {
		maxWidth: '75%',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 16,
	},
	userBubble: {
		backgroundColor: '#E63946',
		borderBottomRightRadius: 4,
		marginLeft: 'auto',
	},
	agentBubble: {
		backgroundColor: '#FFFFFF',
		borderBottomLeftRadius: 4,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	messageText: {
		fontSize: 15,
		lineHeight: 20,
		marginBottom: 4,
	},
	userText: {
		color: '#FFFFFF',
	},
	agentText: {
		color: '#000000',
	},
	timestamp: {
		fontSize: 11,
	},
	userTimestamp: {
		color: '#FFFFFF',
		opacity: 0.8,
		textAlign: 'right',
	},
	agentTimestamp: {
		color: '#666666',
	},
	systemMessageContainer: {
		alignItems: 'center',
		marginVertical: 10,
	},
	systemMessageText: {
		fontSize: 12,
		color: '#6B7280',
		backgroundColor: '#E5E7EB',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
		overflow: 'hidden',
	},
	inputContainer: {
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 8,
	},
	input: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 10,
		fontSize: 15,
		maxHeight: 100,
		color: '#000000',
	},
	sendButton: {
		marginBottom: 2,
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	sendButtonDisabled: {
		opacity: 0.5,
	},
});
