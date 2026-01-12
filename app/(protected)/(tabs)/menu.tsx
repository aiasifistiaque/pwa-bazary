import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGetSelfQuery } from '@/store/services/authApi';

type IconName = React.ComponentProps<typeof IconSymbol>['name'];

type MenuItemProps = {
	icon: IconName;
	title: string;
	onPress?: () => void;
	iconColor?: string;
};

const MenuItem = ({
	icon,
	title,
	onPress,
	iconColor = '#666666',
}: MenuItemProps) => (
	<Pressable style={styles.menuItem} onPress={onPress}>
		<View style={styles.menuItemLeft}>
			<IconSymbol name={icon} size={24} color={iconColor} />
			<Text style={styles.menuItemText}>{title}</Text>
		</View>
		<IconSymbol name='chevron.right' size={20} color='#999999' />
	</Pressable>
);

type CardButtonProps = {
	icon: IconName;
	title: string;
	onPress?: () => void;
};

const CardButton = ({ icon, title, onPress }: CardButtonProps) => (
	<Pressable style={styles.cardButton} onPress={onPress}>
		<IconSymbol name={icon} size={32} color='#666666' />
		<Text style={styles.cardButtonText}>{title}</Text>
	</Pressable>
);

export default function MenuScreen() {
	const { data: userData, isLoading } = useGetSelfQuery({});
	const userName = userData?.name?.trim();
	const firstName = useMemo(() => {
		if (!userName) return null;
		return userName.split(' ')[0];
	}, [userName]);
	const headerTitle = firstName ? `Hi, ${firstName}` : 'Account';

	const handleViewProfile = () => {
		router.push('/profile');
	};

	const handleOrdersPress = () => {
		router.push('/orders');
	};

	const handleHelpCenterPress = () => {
		router.push('/help-center');
	};

	const handleAddressesPress = () => {
		router.push('/addresses');
	};

	const handleFavoritesPress = () => {
		router.push('/(protected)/(tabs)/favorites');
	};

	const handleSubscriptionPress = () => {
		router.push('/subscription');
	};

	const handleVouchersPress = () => {
		router.push('/vouchers');
	};

	const handleRewardsPress = () => {
		router.push('/coming-soon');
	};

	const handleInvitePress = () => {
		router.push('/invite-friends');
	};

	const handleTermsPress = () => {
		router.push('/terms-conditions');
	};

	const handlePrivacyPress = () => {
		router.push('/privacy-policy');
	};

	const handleAboutPress = () => {
		router.push('/about');
	};

	return (
		<View style={styles.container}>
			<View style={styles.safeArea}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.headerTitle}>
						{isLoading ? 'Loading...' : headerTitle}
					</Text>
					{/* <Pressable style={styles.settingsButton}>
						<IconSymbol name='gearshape' size={24} color='#000000' />
					</Pressable> */}
				</View>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* User Profile Section */}
				<View style={styles.profileSection}>
					<View style={styles.profileHeader}>
						<Text style={styles.userName}>
							{isLoading ? 'Loading...' : userName || 'Guest'}
						</Text>
						<View style={styles.proBadge}>
							<IconSymbol name='crown.fill' size={14} color='#FFFFFF' />
							<Text style={styles.proText}>PRO</Text>
						</View>
					</View>
					<Pressable onPress={handleViewProfile}>
						<Text style={styles.viewProfile}>View profile</Text>
					</Pressable>

					{/* Quick Action Cards */}
					<View style={styles.cardsRow}>
						<CardButton
							icon='doc.text'
							title='Orders'
							onPress={handleOrdersPress}
						/>
						<CardButton
							icon='heart'
							title='Favourites'
							onPress={handleFavoritesPress}
						/>
						<CardButton
							icon='mappin.circle'
							title='Addresses'
							onPress={handleAddressesPress}
						/>
					</View>

					{/* Refund Account */}
					{/* <Pressable style={styles.refundCard}>
						<View style={styles.menuItemLeft}>
							<IconSymbol name='creditcard' size={28} color='#E63946' />
							<Text style={styles.refundText}>Refund Account</Text>
						</View>
						<IconSymbol name='chevron.right' size={20} color='#999999' />
					</Pressable> */}
				</View>

				{/* Perks Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Perks for you</Text>
					<MenuItem
						icon='crown.fill'
						title='Subscription'
						iconColor='#666666'
						onPress={handleSubscriptionPress}
					/>
					<MenuItem
						icon='ticket'
						title='Vouchers'
						iconColor='#666666'
						onPress={handleVouchersPress}
					/>
					<MenuItem
						icon='trophy'
						title='bazarey rewards'
						iconColor='#666666'
						onPress={handleRewardsPress}
					/>
					<MenuItem
						icon='gift'
						title='Invite friends'
						iconColor='#666666'
						onPress={handleInvitePress}
					/>
				</View>

				{/* General Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>General</Text>
					<MenuItem
						icon='questionmark.circle'
						title='Help center'
						iconColor='#666666'
						onPress={handleHelpCenterPress}
					/>
					<MenuItem
						icon='doc.text'
						title='Terms & Conditions'
						iconColor='#666666'
						onPress={handleTermsPress}
					/>
					<MenuItem
						icon='shield.checkmark'
						title='Privacy Policy'
						iconColor='#666666'
						onPress={handlePrivacyPress}
					/>
					<MenuItem
						icon='info.circle'
						title='About'
						iconColor='#666666'
						onPress={handleAboutPress}
					/>
				</View>

				{/* Bottom Spacing */}
				<View style={{ height: 40 }} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	safeArea: {
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#000000',
	},
	settingsButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollView: {
		flex: 1,
	},
	profileSection: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 20,
	},
	profileHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		marginBottom: 8,
	},
	userName: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#000000',
	},
	proBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#8B5CF6',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		gap: 4,
	},
	proText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	viewProfile: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 20,
	},
	cardsRow: {
		flexDirection: 'row',
		gap: 12,
		// marginBottom: 16,
	},
	cardButton: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		minHeight: 100,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	cardButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000000',
		textAlign: 'center',
	},
	refundCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	refundText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
	},
	section: {
		backgroundColor: '#FFFFFF',
		// marginTop: 12,
		paddingVertical: 8,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000000',
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F5F5F5',
	},
	menuItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	menuItemText: {
		fontSize: 16,
		color: '#000000',
		fontWeight: '400',
	},
});
