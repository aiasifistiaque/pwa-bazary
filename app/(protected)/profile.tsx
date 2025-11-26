import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
	Alert,
	Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useGetSelfQuery } from '@/store/services/authApi';

export default function ProfileScreen() {
	const dispatch = useDispatch();
	const { data: userData, isLoading, isFetching } = useGetSelfQuery({});
	const isProfileLoading = isLoading || isFetching;
	const displayName = isProfileLoading
		? 'Loading...'
		: userData?.name || 'Guest user';
	const displayEmail = isProfileLoading
		? 'Loading...'
		: userData?.email || 'Email not provided';
	const displayPhone = isProfileLoading
		? 'Loading...'
		: userData?.phone || 'Phone not provided';
	const emailVerified = !!userData?.emailVerified;
	const phoneVerified = !!userData?.phoneVerified;

	const handleBack = () => {
		router.back();
	};

	const handleLogout = () => {
		if (Platform.OS === 'web') {
			const shouldLogout =
				typeof window !== 'undefined'
					? window.confirm('Are you sure you want to logout?')
					: true;

			if (shouldLogout) {
				dispatch(logout());
				router.replace('/login');
			}
			return;
		}

		Alert.alert(
			'Logout',
			'Are you sure you want to logout?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Logout',
					style: 'destructive',
					onPress: () => {
						dispatch(logout());
						router.replace('/login');
					},
				},
			],
			{ cancelable: true }
		);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				{/* Header */}
				<View style={styles.header}>
					<Pressable onPress={handleBack} style={styles.backButton}>
						<IconSymbol name='xmark' size={24} color='#000000' />
					</Pressable>
					<Text style={styles.headerTitle}>Profile</Text>
					<View style={{ width: 40 }} />
				</View>
			</SafeAreaView>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Personal Details Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Personal details</Text>

					{/* Name Field */}
					<View style={styles.fieldCard}>
						<View style={styles.fieldContent}>
							<Text style={styles.fieldLabel}>Name</Text>
							<Text style={styles.fieldValue}>{displayName}</Text>
						</View>
						<Pressable style={styles.editButton}>
							<IconSymbol name='pencil' size={20} color='#666666' />
						</Pressable>
					</View>

					{/* Email Field */}
					<View style={styles.fieldCard}>
						<View style={styles.fieldContent}>
							<Text style={styles.fieldLabel}>Email</Text>
							<Text style={styles.fieldValue}>{displayEmail}</Text>
							{!emailVerified && !isProfileLoading && (
								<Pressable style={styles.verifyButton}>
									<Text style={styles.verifyButtonText}>Verify email</Text>
								</Pressable>
							)}
						</View>
						<Pressable style={styles.editButton}>
							<IconSymbol name='pencil' size={20} color='#666666' />
						</Pressable>
					</View>

					{/* Password Field */}
					<View style={styles.fieldCard}>
						<View style={styles.fieldContent}>
							<Text style={styles.fieldLabel}>Password</Text>
							<Text style={styles.fieldValue}>••••••••••••</Text>
						</View>
						<Pressable style={styles.editButton}>
							<IconSymbol name='pencil' size={20} color='#666666' />
						</Pressable>
					</View>

					{/* Mobile Number Field */}
					<View style={styles.fieldCard}>
						<View style={styles.fieldContent}>
							<Text style={styles.fieldLabel}>Mobile number</Text>
							<Text style={styles.fieldValue}>{displayPhone}</Text>
							{phoneVerified && !isProfileLoading && (
								<View style={styles.verifiedBadge}>
									<IconSymbol name='checkmark' size={14} color='#0066CC' />
									<Text style={styles.verifiedText}>Verified</Text>
								</View>
							)}
						</View>
						<Pressable style={styles.editButton}>
							<IconSymbol name='pencil' size={20} color='#666666' />
						</Pressable>
					</View>
				</View>

				{/* Logout Button */}
				<View style={styles.logoutContainer}>
					<Pressable style={styles.logoutButton} onPress={handleLogout}>
						<IconSymbol name='arrow.right.square' size={20} color='#E63946' />
						<Text style={styles.logoutText}>Logout</Text>
					</Pressable>
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
		backgroundColor: '#F5F5F5',
	},
	safeArea: {
		backgroundColor: '#FFFFFF',
		paddingTop: Platform.OS === 'ios' ? 0 : 40,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
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
	scrollView: {
		flex: 1,
	},
	section: {
		marginTop: 24,
		paddingHorizontal: 16,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 16,
	},
	fieldCard: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	fieldContent: {
		flex: 1,
	},
	fieldLabel: {
		fontSize: 14,
		color: '#666666',
		marginBottom: 8,
	},
	fieldValue: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 8,
	},
	editButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	verifyButton: {
		backgroundColor: '#E63946',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
		alignSelf: 'flex-start',
	},
	verifyButtonText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	verifiedBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#E6F2FF',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		gap: 6,
		alignSelf: 'flex-start',
	},
	verifiedText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#0066CC',
	},
	logoutContainer: {
		paddingHorizontal: 16,
		marginTop: 32,
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		borderWidth: 2,
		borderColor: '#E63946',
		gap: 12,
	},
	logoutText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#E63946',
	},
});
