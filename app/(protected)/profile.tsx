import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
	Alert,
	Platform,
	TextInput,
	ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import {
	useGetSelfQuery,
	useUpdateUserSelfMutation,
} from '@/store/services/authApi';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
	const dispatch = useDispatch();
	const { data: userData, isLoading, isFetching } = useGetSelfQuery({});
	const [updateUserSelf, { isLoading: isUpdating }] =
		useUpdateUserSelfMutation();

	const isProfileLoading = isLoading || isFetching;

	// Edit mode state
	const [isEditMode, setIsEditMode] = useState(false);

	// Form states
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);

	// Display values
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

	// Initialize form when userData loads
	useEffect(() => {
		if (userData) {
			setName(userData.name || '');
			setPhone(userData.phone || '');
		}
	}, [userData]);

	const handleBack = () => {
		if (isEditMode) {
			handleCancel();
		} else {
			router.back();
		}
	};

	const handleEdit = () => {
		setIsEditMode(true);
	};

	const handleCancel = () => {
		// Reset form to original values
		setName(userData?.name || '');
		setPhone(userData?.phone || '');
		setPassword('');
		setCurrentPassword('');
		setShowPassword(false);
		setShowCurrentPassword(false);
		setIsEditMode(false);
	};

	const handleSave = async () => {
		try {
			// Validate inputs
			if (!name.trim()) {
				if (Platform.OS === 'web') {
					alert('Name is required');
				} else {
					Alert.alert('Error', 'Name is required');
				}
				return;
			}

			if (password && !currentPassword) {
				if (Platform.OS === 'web') {
					alert('Please enter your current password to change password');
				} else {
					Alert.alert(
						'Error',
						'Please enter your current password to change password'
					);
				}
				return;
			}

			// Prepare update payload
			const updateData: any = {
				name: name.trim(),
				phone: phone.trim(),
			};

			if (password) {
				updateData.password = password;
				updateData.currentPassword = currentPassword;
			}

			// Call the update API
			const result = await updateUserSelf(updateData).unwrap();

			// Show success message
			if (Platform.OS === 'web') {
				alert('Profile updated successfully!');
			} else {
				Alert.alert('Success', 'Profile updated successfully!');
			}

			// Reset password fields and exit edit mode
			setPassword('');
			setCurrentPassword('');
			setShowPassword(false);
			setShowCurrentPassword(false);
			setIsEditMode(false);
		} catch (error: any) {
			const errorMessage =
				error?.data?.message || 'Failed to update profile. Please try again.';
			if (Platform.OS === 'web') {
				alert(errorMessage);
			} else {
				Alert.alert('Error', errorMessage);
			}
		}
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
			<View style={styles.safeArea}>
				{/* Header */}
				<View style={styles.header}>
					<Pressable onPress={handleBack} style={styles.backButton}>
						<IconSymbol name='xmark' size={24} color='#000000' />
					</Pressable>
					<Text style={styles.headerTitle}>Profile</Text>
					<View style={{ width: 40 }} />
				</View>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Personal Details Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Personal details</Text>
						<View style={styles.actionButtons}>
							{!isEditMode ? (
								<Pressable
									style={styles.editButtonTop}
									onPress={handleEdit}
									disabled={isProfileLoading}
								>
									<Text style={styles.editButtonText}>Edit</Text>
								</Pressable>
							) : (
								<>
									<Pressable
										style={styles.cancelButton}
										onPress={handleCancel}
										disabled={isUpdating}
									>
										<Text style={styles.cancelButtonText}>Cancel</Text>
									</Pressable>
									<Pressable
										style={[
											styles.saveButton,
											isUpdating && styles.saveButtonDisabled,
										]}
										onPress={handleSave}
										disabled={isUpdating}
									>
										{isUpdating ? (
											<ActivityIndicator size='small' color='#FFFFFF' />
										) : (
											<Text style={styles.saveButtonText}>Save</Text>
										)}
									</Pressable>
								</>
							)}
						</View>
					</View>

					{/* Name Field */}
					<View style={styles.fieldCard}>
						<View style={styles.fieldContent}>
							<Text style={styles.fieldLabel}>Name</Text>
							{isEditMode ? (
								<TextInput
									style={styles.textInput}
									value={name}
									onChangeText={setName}
									placeholder='Enter your name'
									editable={!isUpdating}
								/>
							) : (
								<Text style={styles.fieldValue}>{displayName}</Text>
							)}
						</View>
					</View>

					{/* Email Field - Not Editable */}
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
					</View>

					{/* Password Field */}
					<View style={styles.fieldCard}>
						<View style={styles.fieldContent}>
							<Text style={styles.fieldLabel}>Password</Text>
							{isEditMode ? (
								<>
									<View style={styles.passwordContainer}>
										<TextInput
											style={styles.passwordInput}
											value={currentPassword}
											onChangeText={setCurrentPassword}
											placeholder='Current password'
											secureTextEntry={!showCurrentPassword}
											editable={!isUpdating}
										/>
										<Pressable
											style={styles.eyeButton}
											onPress={() => setShowCurrentPassword(prev => !prev)}
										>
											<FontAwesome
												name={showCurrentPassword ? 'eye' : 'eye-slash'}
												size={20}
												color='#666'
											/>
										</Pressable>
									</View>
									<View style={styles.passwordContainer}>
										<TextInput
											style={styles.passwordInput}
											value={password}
											onChangeText={setPassword}
											placeholder='New password (optional)'
											secureTextEntry={!showPassword}
											editable={!isUpdating}
										/>
										<Pressable
											style={styles.eyeButton}
											onPress={() => setShowPassword(prev => !prev)}
										>
											<FontAwesome
												name={showPassword ? 'eye' : 'eye-slash'}
												size={20}
												color='#666'
											/>
										</Pressable>
									</View>
								</>
							) : (
								<Text style={styles.fieldValue}>••••••••••••</Text>
							)}
						</View>
					</View>

					{/* Mobile Number Field */}
					<View style={styles.fieldCard}>
						<View style={styles.fieldContent}>
							<Text style={styles.fieldLabel}>Mobile number</Text>
							{isEditMode ? (
								<TextInput
									style={styles.textInput}
									value={phone}
									onChangeText={setPhone}
									placeholder='Enter your phone number'
									keyboardType='phone-pad'
									editable={!isUpdating}
								/>
							) : (
								<>
									<Text style={styles.fieldValue}>{displayPhone}</Text>
									{phoneVerified && !isProfileLoading && (
										<View style={styles.verifiedBadge}>
											<IconSymbol name='checkmark' size={14} color='#0066CC' />
											<Text style={styles.verifiedText}>Verified</Text>
										</View>
									)}
								</>
							)}
						</View>
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
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000000',
	},
	actionButtons: {
		flexDirection: 'row',
		gap: 8,
	},
	editButtonTop: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#000000',
		borderRadius: 8,
	},
	editButtonText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
	},
	cancelButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#E5E5E5',
		borderRadius: 8,
	},
	cancelButtonText: {
		color: '#000000',
		fontSize: 14,
		fontWeight: '600',
	},
	saveButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#0066CC',
		borderRadius: 8,
		minWidth: 60,
		alignItems: 'center',
	},
	saveButtonDisabled: {
		backgroundColor: '#A0A0A0',
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 14,
		fontWeight: '600',
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
	textInput: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		padding: 12,
		marginBottom: 8,
		backgroundColor: '#FAFAFA',
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		backgroundColor: '#FAFAFA',
		marginBottom: 8,
	},
	passwordInput: {
		flex: 1,
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
		padding: 12,
	},
	eyeButton: {
		padding: 12,
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
		// marginTop: 32,
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
