import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCreateChatMutation } from '@/store/services/chatApi';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { RootState } from '@/store';
import { useGetSelfQuery } from '@/store/services/authApi';
import { useGetAllFaqsQuery } from '@/store/services/faqApi';
import { ScrollView, TouchableOpacity } from 'react-native';

export default function NewChatScreen() {
	const { data: user } = useGetSelfQuery({});
	const insets = useSafeAreaInsets();
	const [createChat, { isLoading: isCreating }] = useCreateChatMutation();
	const [inputText, setInputText] = useState('');

	const handleSend = async () => {
		if (!user?._id) {
			console.log('User ID not found in getSelf result:', user);
			return;
		}

		if (inputText.trim() === '') return;

		try {
			const result = await createChat({
				customerId: user._id,
				subject: inputText.trim(),
				firstMessage: inputText.trim(),
				priority: 'medium',
			}).unwrap();

			if (result?.data?._id || result?.data?.doc?._id) {
				const chatId = result?.data?._id || result?.data?.doc?._id;
				router.replace(`/conversation/${chatId}`);
			}
		} catch (error) {
			console.error('Failed to start chat:', error);
		}
	};

	const { data: faqsData, isLoading: isFaqsLoading } = useGetAllFaqsQuery({
		limit: 6,
		filters: { isActive: true },
	});

	const handleFaqPress = (question: string) => {
		setInputText(question);
	};

	// Handle various potential response structures
	const faqs =
		faqsData?.data?.doc || // Nested data.doc
		faqsData?.doc || // Direct doc
		faqsData?.data || // Direct data array
		[];

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
						<Text style={styles.headerTitle}>New Support Chat</Text>
					</View>
					<View style={{ width: 40 }} />
				</View>

				{/* Empty Chat Area */}
				<View style={styles.emptyContainer}>
					<View style={styles.infoBox}>
						<IconSymbol
							name='bubble.left.and.bubble.right.fill'
							size={48}
							color='#E63946'
						/>
						<Text style={styles.infoTitle}>How can we help you?</Text>
						<Text style={styles.infoText}>
							Type your message below to start a conversation with our support
							team.
						</Text>
					</View>
				</View>

				{/* FAQ Bubbles */}
				{faqs.length > 0 && (
					<View style={styles.faqContainer}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.faqContentContainer}
						>
							{faqs.map((faq: any, index: number) => (
								<TouchableOpacity
									key={faq._id || index}
									style={styles.faqBubble}
									onPress={() => handleFaqPress(faq.question)}
								>
									<Text style={styles.faqText}>{faq.question}</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				)}

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
							placeholder='Type your first message...'
							placeholderTextColor='#999999'
							value={inputText}
							onChangeText={setInputText}
							multiline
							maxLength={500}
							autoFocus
						/>
						<Pressable
							style={[
								styles.sendButton,
								(inputText.trim() === '' || isCreating) &&
									styles.sendButtonDisabled,
							]}
							onPress={handleSend}
							disabled={inputText.trim() === '' || isCreating}
						>
							{isCreating ? (
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
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 40,
	},
	infoBox: {
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		padding: 30,
		borderRadius: 24,
		width: '100%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
	},
	infoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#111827',
		marginTop: 16,
		textAlign: 'center',
	},
	infoText: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
		marginTop: 8,
		lineHeight: 20,
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
	faqContainer: {
		paddingVertical: 10,
		backgroundColor: '#FFFFFF', //Or transparent if needed
	},
	faqContentContainer: {
		paddingHorizontal: 16,
		gap: 8,
	},
	faqBubble: {
		backgroundColor: '#F3F4F6',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#E5E7EB',
	},
	faqText: {
		fontSize: 13,
		color: '#1F2937',
	},
});
