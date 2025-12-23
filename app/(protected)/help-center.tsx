import { IconSymbol } from '@/components/ui/icon-symbol';
import {
	useCreateChatMutation,
	useGetChatsByCustomerQuery,
} from '@/store/services/chatApi';
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
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetSelfQuery } from '@/store/services/authApi';

type Chat = {
	_id: string;
	subject: string;
	status: string;
	createdAt: string;
	lastMessageAt: string;
	messageCount: number;
};

export default function HelpCenterScreen() {
	const { data: user } = useGetSelfQuery({});
	const {
		data: chatsData,
		isLoading,
		refetch,
	} = useGetChatsByCustomerQuery(user?._id, { skip: !user?._id });

	const handleCreateChat = () => {
		router.push('/new-chat');
	};

	const renderChatCard = ({ item }: { item: Chat }) => (
		<Pressable
			style={styles.chatCard}
			onPress={() => router.push(`/conversation/${item._id}`)}
		>
			<View style={styles.chatCardHeader}>
				<View style={styles.chatAvatar}>
					<IconSymbol name='message.fill' size={24} color='#FFFFFF' />
				</View>
				<View style={styles.chatInfo}>
					<Text style={styles.chatSubject} numberOfLines={1}>
						{item.subject}
					</Text>
					<Text style={styles.chatDate}>
						{new Date(
							item.lastMessageAt || item.createdAt
						).toLocaleDateString()}
					</Text>
				</View>
				<View style={[styles.statusBadge, getStatusStyle(item.status)]}>
					<Text style={styles.statusText}>{item.status}</Text>
				</View>
			</View>
			<View style={styles.chatCardFooter}>
				<Text style={styles.messageCount}>
					{item.messageCount || 0} messages
				</Text>
				<IconSymbol name='chevron.right' size={16} color='#9CA3AF' />
			</View>
		</Pressable>
	);

	const getStatusStyle = (status: string) => {
		switch (status) {
			case 'unresolved':
				return { backgroundColor: '#FEE2E2', color: '#B91C1C' };
			case 'ongoing':
				return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
			case 'resolved':
				return { backgroundColor: '#D1FAE5', color: '#065F46' };
			default:
				return { backgroundColor: '#F3F4F6', color: '#374151' };
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Help Center</Text>
				<View style={{ width: 40 }} />
			</View>

			<View style={styles.container}>
				<View style={styles.topSection}>
					<Text style={styles.sectionTitle}>Your Conversations</Text>
					<Pressable style={styles.createButton} onPress={handleCreateChat}>
						<IconSymbol name='plus' size={20} color='#FFFFFF' />
						<Text style={styles.createButtonText}>New Message</Text>
					</Pressable>
				</View>

				{isLoading ? (
					<ActivityIndicator
						size='large'
						color='#E63946'
						style={{ marginTop: 50 }}
					/>
				) : (
					<FlatList
						data={chatsData?.data || []}
						renderItem={renderChatCard}
						keyExtractor={item => item._id}
						contentContainerStyle={styles.listContainer}
						ListEmptyComponent={
							<View style={styles.emptyState}>
								<IconSymbol
									name='bubble.left.and.bubble.right.fill'
									size={64}
									color='#D1D5DB'
								/>
								<Text style={styles.emptyStateText}>No conversations yet</Text>
								<Text style={styles.emptyStateSubtext}>
									Start a new chat to get help from our support team
								</Text>
							</View>
						}
						onRefresh={refetch}
						refreshing={isLoading}
					/>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	container: {
		flex: 1,
		backgroundColor: '#F9FAFB',
	},
	topSection: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#374151',
	},
	createButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#E63946',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 20,
		gap: 6,
	},
	createButtonText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
	},
	listContainer: {
		padding: 16,
		gap: 12,
	},
	chatCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: '#E5E7EB',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	chatCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	chatAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#E63946',
		alignItems: 'center',
		justifyContent: 'center',
	},
	chatInfo: {
		flex: 1,
	},
	chatSubject: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#111827',
	},
	chatDate: {
		fontSize: 12,
		color: '#6B7280',
		marginTop: 2,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 12,
	},
	statusText: {
		fontSize: 10,
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	chatCardFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 12,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#F3F4F6',
	},
	messageCount: {
		fontSize: 13,
		color: '#6B7280',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 80,
		paddingHorizontal: 40,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#374151',
		marginTop: 16,
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
		marginTop: 8,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 20,
		paddingHorizontal: 20,
		paddingBottom: Platform.OS === 'ios' ? 40 : 20,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#111827',
	},
	modalBody: {
		gap: 16,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		marginBottom: 4,
	},
	modalInput: {
		backgroundColor: '#F3F4F6',
		borderRadius: 12,
		padding: 12,
		fontSize: 15,
		borderWidth: 1,
		borderColor: '#E5E7EB',
	},
	textArea: {
		height: 100,
		textAlignVertical: 'top',
	},
	modalSubmitButton: {
		backgroundColor: '#E63946',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		marginTop: 8,
	},
	modalSubmitButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	disabledButton: {
		backgroundColor: '#FCA5A5',
	},
});
