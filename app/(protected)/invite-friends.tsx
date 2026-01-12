import { IconSymbol } from '@/components/ui/icon-symbol';
import { Toast } from '@/components/ui/Toast';
import { CustomColors } from '@/constants/theme';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	Pressable,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InviteFriendsScreen() {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const referralCode = 'BAZAREY2026';

	const handleCopy = async () => {
		await Clipboard.setStringAsync(referralCode);
		setToastMessage('Referral code copied!');
		setToastVisible(true);
	};

	const handleShare = async () => {
		try {
			await Share.share({
				message: `Join me on Bazarey! Use my code ${referralCode} to get ৳100 off your first order.`,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Invite Friends</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.vectorContainer}>
					<IconSymbol
						name='person.2.fill'
						size={80}
						color={CustomColors.darkGreen}
					/>
				</View>

				<Text style={styles.title}>Refer a Friend, Earn Rewards!</Text>
				<Text style={styles.description}>
					Share your referral code with friends. When they place their first
					order, you both get ৳100 off!
				</Text>

				<View style={styles.codeContainer}>
					<Text style={styles.codeLabel}>Your Referral Code</Text>
					<Pressable style={styles.codeBox} onPress={handleCopy}>
						<Text style={styles.codeText}>{referralCode}</Text>
						<IconSymbol
							name='doc.on.doc'
							size={20}
							color={CustomColors.darkGreen}
						/>
					</Pressable>
				</View>

				<Pressable style={styles.shareButton} onPress={handleShare}>
					<Text style={styles.shareButtonText}>Share Code</Text>
				</Pressable>
			</ScrollView>

			<Toast
				message={toastMessage}
				visible={toastVisible}
				onDismiss={() => setToastVisible(false)}
			/>
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
		padding: 24,
		alignItems: 'center',
	},
	vectorContainer: {
		width: 160,
		height: 160,
		borderRadius: 80,
		backgroundColor: '#E8F5E9',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 32,
		marginTop: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		textAlign: 'center',
		marginBottom: 16,
	},
	description: {
		fontSize: 16,
		color: CustomColors.subTextColor,
		textAlign: 'center',
		marginBottom: 32,
		lineHeight: 24,
	},
	codeContainer: {
		width: '100%',
		marginBottom: 32,
	},
	codeLabel: {
		fontSize: 14,
		color: CustomColors.subTextColor,
		marginBottom: 8,
		textAlign: 'center',
	},
	codeBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#F8F8F8',
		borderWidth: 1,
		borderColor: CustomColors.darkGreen,
		borderRadius: 8,
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderStyle: 'dashed',
	},
	codeText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: CustomColors.textColor,
		letterSpacing: 2,
	},
	shareButton: {
		backgroundColor: CustomColors.lightBrown,
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 12,
		width: '100%',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	shareButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
	},
});
