import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
	id: string;
	text: string;
	sender: 'user' | 'agent';
	timestamp: string;
	status?: 'sending' | 'sent' | 'failed';
};

const initialMessages: Message[] = [
	{
		id: '1',
		text: 'Hello! Welcome to bazarey customer support. How can I help you today?',
		sender: 'agent',
		timestamp: '10:30 AM',
		status: 'sent',
	},
];

const quickReplies = [
	{ id: '1', text: 'Track my order' },
	{ id: '2', text: 'Payment issue' },
	{ id: '3', text: 'Refund request' },
	{ id: '4', text: 'Product inquiry' },
];

export default function HelpCenterScreen() {
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const [inputText, setInputText] = useState('');
	const [isTyping, setIsTyping] = useState(false);

	const handleSend = () => {
		if (inputText.trim() === '') return;

		const newMessage: Message = {
			id: Date.now().toString(),
			text: inputText.trim(),
			sender: 'user',
			timestamp: new Date().toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
			}),
			status: 'sent',
		};

		setMessages(prev => [...prev, newMessage]);
		setInputText('');

		// Simulate agent typing
		setIsTyping(true);
		setTimeout(() => {
			simulateAgentResponse(inputText.trim());
		}, 1500);
	};

	const simulateAgentResponse = (userMessage: string) => {
		const lowerMessage = userMessage.toLowerCase();
		let responseText =
			'I understand your concern. Let me help you with that. Could you provide more details?';

		if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
			responseText =
				'I can help you track your order. Please provide your order number (e.g., #12345) so I can check the status for you.';
		} else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
			responseText =
				'I see you have a payment-related question. Are you facing issues with payment processing, or do you need help with payment methods?';
		} else if (lowerMessage.includes('refund') || lowerMessage.includes('return')) {
			responseText =
				'I can assist with refund requests. Refunds are typically processed within 5-7 business days. Do you have a specific order you need a refund for?';
		} else if (lowerMessage.includes('delivery') || lowerMessage.includes('deliver')) {
			responseText =
				'Our standard delivery time is 1-2 hours for nearby areas. Is there a specific delivery issue you are experiencing?';
		} else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
			responseText = 'Hello! How can I assist you today?';
		} else if (lowerMessage.includes('thank')) {
			responseText = "You're welcome! Is there anything else I can help you with?";
		}

		const agentMessage: Message = {
			id: Date.now().toString(),
			text: responseText,
			sender: 'agent',
			timestamp: new Date().toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
			}),
			status: 'sent',
		};

		setIsTyping(false);
		setMessages(prev => [...prev, agentMessage]);
	};

	const handleQuickReply = (text: string) => {
		setInputText(text);
	};

	const renderMessage = ({ item }: { item: Message }) => {
		const isUser = item.sender === 'user';

		return (
			<View style={[styles.messageContainer, isUser ? styles.userMessage : styles.agentMessage]}>
				{!isUser && (
					<View style={styles.agentAvatar}>
						<IconSymbol
							name='person.fill'
							size={20}
							color='#FFFFFF'
						/>
					</View>
				)}
				<View style={[styles.messageBubble, isUser ? styles.userBubble : styles.agentBubble]}>
					<Text style={[styles.messageText, isUser ? styles.userText : styles.agentText]}>
						{item.text}
					</Text>
					<Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.agentTimestamp]}>
						{item.timestamp}
					</Text>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
				{/* Header */}
				<View style={styles.header}>
					<Pressable
						onPress={() => router.back()}
						style={styles.backButton}>
						<IconSymbol
							name='chevron.left'
							size={24}
							color='#000000'
						/>
					</Pressable>
					<View style={styles.headerCenter}>
						<View style={styles.agentInfo}>
							<View style={styles.agentAvatarHeader}>
								<IconSymbol
									name='person.fill'
									size={20}
									color='#FFFFFF'
								/>
							</View>
							<View>
								<Text style={styles.headerTitle}>Customer Support</Text>
								<View style={styles.onlineStatus}>
									<View style={styles.onlineDot} />
									<Text style={styles.onlineText}>Online</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={{ width: 40 }} />
				</View>

				{/* Messages List */}
				<FlatList
					data={messages}
					renderItem={renderMessage}
					keyExtractor={item => item.id}
					contentContainerStyle={styles.messagesList}
					showsVerticalScrollIndicator={false}
					inverted={false}
					ListFooterComponent={
						isTyping ? (
							<View style={styles.typingContainer}>
								<View style={styles.agentAvatar}>
									<IconSymbol
										name='person.fill'
										size={20}
										color='#FFFFFF'
									/>
								</View>
								<View style={styles.typingBubble}>
									<View style={styles.typingDots}>
										<View style={[styles.dot, styles.dot1]} />
										<View style={[styles.dot, styles.dot2]} />
										<View style={[styles.dot, styles.dot3]} />
									</View>
								</View>
							</View>
						) : null
					}
				/>

				{/* Quick Replies */}
				{messages.length <= 2 && (
					<View style={styles.quickRepliesContainer}>
						<Text style={styles.quickRepliesTitle}>Quick replies</Text>
						<View style={styles.quickReplies}>
							{quickReplies.map(reply => (
								<Pressable
									key={reply.id}
									style={styles.quickReplyButton}
									onPress={() => handleQuickReply(reply.text)}>
									<Text style={styles.quickReplyText}>{reply.text}</Text>
								</Pressable>
							))}
						</View>
					</View>
				)}

				{/* Input Area */}
				<View style={styles.inputContainer}>
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
							style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
							onPress={handleSend}
							disabled={inputText.trim() === ''}>
							<IconSymbol
								name='arrow.up.circle.fill'
								size={32}
								color={inputText.trim() === '' ? '#D0D0D0' : '#E63946'}
							/>
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
		backgroundColor: '#10B981',
	},
	onlineText: {
		fontSize: 12,
		color: '#10B981',
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
	typingContainer: {
		flexDirection: 'row',
		marginBottom: 16,
		alignItems: 'flex-end',
	},
	typingBubble: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 16,
		borderBottomLeftRadius: 4,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	typingDots: {
		flexDirection: 'row',
		gap: 4,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#D0D0D0',
	},
	dot1: {
		opacity: 0.4,
	},
	dot2: {
		opacity: 0.7,
	},
	dot3: {
		opacity: 1,
	},
	quickRepliesContainer: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
	},
	quickRepliesTitle: {
		fontSize: 13,
		color: '#666666',
		marginBottom: 8,
		fontWeight: '600',
	},
	quickReplies: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	quickReplyButton: {
		backgroundColor: '#F5F5F5',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	quickReplyText: {
		fontSize: 13,
		color: '#E63946',
		fontWeight: '600',
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
	},
	sendButtonDisabled: {
		opacity: 0.5,
	},
});
