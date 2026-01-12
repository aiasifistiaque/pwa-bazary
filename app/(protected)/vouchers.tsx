import { IconSymbol } from '@/components/ui/icon-symbol';
import { Toast } from '@/components/ui/Toast';
import { CustomColors } from '@/constants/theme';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VouchersScreen() {
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState('');

	const vouchers = [
		{
			id: '1',
			code: 'WELCOME50',
			title: '50% Off First Order',
			description: 'Valid for new users only. Max discount ৳200.',
			expiry: 'Valid until 31 Dec 2026',
		},
		{
			id: '2',
			code: 'FREESHIP',
			title: 'Free Shipping',
			description: 'On orders above ৳1000.',
			expiry: 'Valid until 30 Jun 2026',
		},
	];

	const handleCopy = async (code: string) => {
		await Clipboard.setStringAsync(code);
		setToastMessage('Voucher code copied!');
		setToastVisible(true);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.header}>
				<Pressable onPress={() => router.back()} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Vouchers</Text>
				<View style={{ width: 40 }} />
			</View>

			<FlatList
				data={vouchers}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.content}
				renderItem={({ item }) => (
					<View style={styles.voucherCard}>
						<View style={styles.voucherLeft}>
							<IconSymbol
								name='ticket.fill'
								size={32}
								color={CustomColors.darkGreen}
							/>
						</View>
						<View style={styles.voucherRight}>
							<Text style={styles.voucherTitle}>{item.title}</Text>
							<Text style={styles.voucherCode}>{item.code}</Text>
							<Text style={styles.voucherDesc}>{item.description}</Text>
							<Text style={styles.voucherExpiry}>{item.expiry}</Text>
						</View>
						<Pressable
							style={styles.applyButton}
							onPress={() => handleCopy(item.code)}
						>
							<Text style={styles.applyButtonText}>Copy</Text>
						</Pressable>
					</View>
				)}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<IconSymbol
							name='ticket'
							size={48}
							color={CustomColors.subTextColor}
						/>
						<Text style={styles.emptyText}>No vouchers available</Text>
					</View>
				}
			/>

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
		padding: 16,
	},
	voucherCard: {
		flexDirection: 'row',
		backgroundColor: CustomColors.cardBgColor,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	voucherLeft: {
		paddingRight: 16,
		borderRightWidth: 1,
		borderRightColor: '#E5E5E5',
		justifyContent: 'center',
		alignItems: 'center',
	},
	voucherRight: {
		flex: 1,
		paddingLeft: 16,
	},
	voucherTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: CustomColors.textColor,
	},
	voucherCode: {
		fontSize: 14,
		fontWeight: 'bold',
		color: CustomColors.darkGreen,
		marginVertical: 4,
	},
	voucherDesc: {
		fontSize: 12,
		color: CustomColors.subTextColor,
		marginBottom: 4,
	},
	voucherExpiry: {
		fontSize: 11,
		color: '#999999',
	},
	applyButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 4,
	},
	applyButtonText: {
		fontSize: 12,
		fontWeight: '600',
		color: CustomColors.darkBrown,
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 48,
	},
	emptyText: {
		marginTop: 16,
		fontSize: 16,
		color: CustomColors.subTextColor,
	},
});
