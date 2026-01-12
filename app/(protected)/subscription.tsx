import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Subscription</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.card}>
					<IconSymbol name='crown.fill' size={48} color='#8B5CF6' />
					<Text style={styles.cardTitle}>Upgrade to Pro</Text>
					<Text style={styles.cardDescription}>
						Get free delivery, exclusive discounts, and more with Bazarey Pro.
					</Text>
					<Pressable
						style={styles.upgradeButton}
						onPress={() => router.push('/coming-soon')}
					>
						<Text style={styles.upgradeButtonText}>Subscribe Now</Text>
					</Pressable>
				</View>

				<View style={styles.benefitRow}>
					<IconSymbol
						name='truck.fill'
						size={24}
						color={CustomColors.darkGreen}
					/>
					<View style={styles.benefitTextContainer}>
						<Text style={styles.benefitTitle}>Free Delivery</Text>
						<Text style={styles.benefitDescription}>
							On all orders over ৳500
						</Text>
					</View>
				</View>

				<View style={styles.benefitRow}>
					<IconSymbol
						name='tag.fill'
						size={24}
						color={CustomColors.darkGreen}
					/>
					<View style={styles.benefitTextContainer}>
						<Text style={styles.benefitTitle}>Exclusive Discounts</Text>
						<Text style={styles.benefitDescription}>
							Up to 20% off on selected items
						</Text>
					</View>
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
	card: {
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
	cardTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		marginTop: 16,
		marginBottom: 8,
	},
	cardDescription: {
		fontSize: 14,
		color: CustomColors.subTextColor,
		textAlign: 'center',
		marginBottom: 24,
	},
	upgradeButton: {
		backgroundColor: CustomColors.lightBrown,
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
	},
	upgradeButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
	},
	benefitRow: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F8F8F8',
		padding: 16,
		borderRadius: 8,
		marginBottom: 12,
	},
	benefitTextContainer: {
		marginLeft: 16,
		flex: 1,
	},
	benefitTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: CustomColors.textColor,
	},
	benefitDescription: {
		fontSize: 13,
		color: CustomColors.subTextColor,
	},
});
