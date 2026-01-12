import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RewardsScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Bazarey Rewards</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.pointsCard}>
					<View style={styles.pointsCircle}>
						<IconSymbol name='trophy.fill' size={40} color='#FFD700' />
						<Text style={styles.pointsValue}>1,250</Text>
						<Text style={styles.pointsLabel}>Points</Text>
					</View>
					<Text style={styles.pointsSubtext}>Gold Member</Text>
				</View>

				<Text style={styles.sectionTitle}>How to earn</Text>
				<View style={styles.earnRow}>
					<View style={styles.earnIconContainer}>
						<IconSymbol name='cart.fill' size={20} color='#FFFFFF' />
					</View>
					<View style={styles.earnTextContainer}>
						<Text style={styles.earnTitle}>Place orders</Text>
						<Text style={styles.earnDesc}>
							Earn 10 points for every ৳100 spent
						</Text>
					</View>
				</View>
				<View style={styles.earnRow}>
					<View style={styles.earnIconContainer}>
						<IconSymbol name='star.fill' size={20} color='#FFFFFF' />
					</View>
					<View style={styles.earnTextContainer}>
						<Text style={styles.earnTitle}>Leave a review</Text>
						<Text style={styles.earnDesc}>Earn 50 points per review</Text>
					</View>
				</View>

				<Text style={styles.sectionTitle}>Rewards History</Text>
				<View style={styles.historyItem}>
					<View>
						<Text style={styles.historyTitle}>Order #12345</Text>
						<Text style={styles.historyDate}>12 Jan 2026</Text>
					</View>
					<Text style={styles.historyPoints}>+120 pts</Text>
				</View>
				<View style={styles.historyItem}>
					<View>
						<Text style={styles.historyTitle}>Review Reward</Text>
						<Text style={styles.historyDate}>10 Jan 2026</Text>
					</View>
					<Text style={styles.historyPoints}>+50 pts</Text>
				</View>
			</ScrollView>
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
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	content: {
		padding: 16,
	},
	pointsCard: {
		backgroundColor: CustomColors.cardBgColor,
		borderRadius: 12,
		padding: 24,
		alignItems: 'center',
		marginBottom: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	pointsCircle: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: '#FFF9E6',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
		borderWidth: 4,
		borderColor: '#FFD700',
	},
	pointsValue: {
		fontSize: 28,
		fontWeight: 'bold',
		color: CustomColors.textColor,
	},
	pointsLabel: {
		fontSize: 14,
		color: CustomColors.subTextColor,
	},
	pointsSubtext: {
		fontSize: 16,
		fontWeight: '600',
		color: '#D4AF37', // Gold color
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		marginTop: 16,
		marginBottom: 12,
	},
	earnRow: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		padding: 12,
		borderRadius: 8,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	earnIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: CustomColors.darkGreen,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	earnTextContainer: {
		flex: 1,
	},
	earnTitle: {
		fontSize: 15,
		fontWeight: '600',
		color: CustomColors.textColor,
	},
	earnDesc: {
		fontSize: 12,
		color: CustomColors.subTextColor,
	},
	historyItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	historyTitle: {
		fontSize: 15,
		fontWeight: '500',
		color: CustomColors.textColor,
	},
	historyDate: {
		fontSize: 12,
		color: CustomColors.subTextColor,
		marginTop: 2,
	},
	historyPoints: {
		fontSize: 16,
		fontWeight: 'bold',
		color: CustomColors.darkGreen,
	},
});
