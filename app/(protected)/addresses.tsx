import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppDispatch, RootState } from '@/store';
import {
	addAddress as addAddressAction,
	Address,
	deleteAddress as deleteAddressAction,
	setDefaultAddress as setDefaultAddressAction,
	updateAddress as updateAddressAction,
} from '@/store/slices/addressSlice';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	Alert,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function AddressesScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const addresses = useSelector((state: RootState) => state.address.addresses);

	const [showAddForm, setShowAddForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<Omit<Address, 'id' | 'isDefault'>>({
		label: '',
		name: '',
		phone: '',
		street: '',
		area: '',
		city: '',
		postalCode: '',
	});

	const handleGetCurrentLocation = () => {
		Alert.alert(
			'Get Current Location',
			'This will use your device GPS to get your current address.',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Allow',
					onPress: () => {
						// Simulate getting location
						setFormData(prev => ({
							...prev,
							street: 'Current GPS Location Street',
							area: 'Auto-detected Area',
							city: 'Dhaka',
							postalCode: '1200',
						}));
						Alert.alert('Success', 'Location detected and fields populated!');
					},
				},
			]
		);
	};

	const handleSaveAddress = () => {
		if (
			!formData.label ||
			!formData.name ||
			!formData.phone ||
			!formData.street ||
			!formData.area ||
			!formData.city
		) {
			Alert.alert('Error', 'Please fill in all required fields');
			return;
		}

		if (editingId) {
			// Update existing address
			const existingAddress = addresses.find(addr => addr.id === editingId);
			if (existingAddress) {
				dispatch(
					updateAddressAction({
						...formData,
						id: editingId,
						isDefault: existingAddress.isDefault,
					})
				);
			}
			setEditingId(null);
		} else {
			// Add new address
			dispatch(addAddressAction(formData));
		}

		// Reset form
		setFormData({
			label: '',
			name: '',
			phone: '',
			street: '',
			area: '',
			city: '',
			postalCode: '',
		});
		setShowAddForm(false);
	};

	const handleEdit = (address: Address) => {
		setFormData({
			label: address.label,
			name: address.name,
			phone: address.phone,
			street: address.street,
			area: address.area,
			city: address.city,
			postalCode: address.postalCode,
		});
		setEditingId(address.id);
		setShowAddForm(true);
	};

	const handleDelete = (id: string) => {
		Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Delete',
				style: 'destructive',
				onPress: () => {
					dispatch(deleteAddressAction(id));
				},
			},
		]);
	};

	const handleSetDefault = (id: string) => {
		dispatch(setDefaultAddressAction(id));
	};

	return (
		<SafeAreaView style={styles.safeArea}>
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
				<Text style={styles.headerTitle}>My Addresses</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}>
				{/* Saved Addresses */}
				<View style={styles.addressesContainer}>
					{addresses.map(address => (
						<View
							key={address.id}
							style={[styles.addressCard, address.isDefault && styles.defaultAddressCard]}>
							<View style={styles.addressHeader}>
								<View style={styles.addressLabelContainer}>
									<IconSymbol
										name={address.label === 'Home' ? 'house.fill' : 'building.2.fill'}
										size={20}
										color='#E63946'
									/>
									<Text style={styles.addressLabel}>{address.label}</Text>
									{address.isDefault && (
										<View style={styles.defaultBadge}>
											<Text style={styles.defaultBadgeText}>Default</Text>
										</View>
									)}
								</View>
								<View style={styles.addressActions}>
									<Pressable
										onPress={() => handleEdit(address)}
										style={styles.actionButton}>
										<IconSymbol
											name='pencil'
											size={18}
											color='#666666'
										/>
									</Pressable>
									<Pressable
										onPress={() => handleDelete(address.id)}
										style={styles.actionButton}>
										<IconSymbol
											name='trash'
											size={18}
											color='#EF4444'
										/>
									</Pressable>
								</View>
							</View>

							<View style={styles.addressContent}>
								<Text style={styles.addressName}>{address.name}</Text>
								<Text style={styles.addressText}>{address.phone}</Text>
								<Text style={styles.addressText}>
									{address.street}, {address.area}
								</Text>
								<Text style={styles.addressText}>
									{address.city} - {address.postalCode}
								</Text>
							</View>

							{!address.isDefault && (
								<Pressable
									style={styles.setDefaultButton}
									onPress={() => handleSetDefault(address.id)}>
									<Text style={styles.setDefaultText}>Set as Default</Text>
								</Pressable>
							)}
						</View>
					))}

					{addresses.length === 0 && (
						<View style={styles.emptyState}>
							<IconSymbol
								name='mappin.circle'
								size={64}
								color='#D0D0D0'
							/>
							<Text style={styles.emptyStateText}>No saved addresses</Text>
							<Text style={styles.emptyStateSubtext}>Add your first address to get started</Text>
						</View>
					)}
				</View>

				{/* Add/Edit Address Form */}
				{showAddForm && (
					<View style={styles.formContainer}>
						<View style={styles.formHeader}>
							<Text style={styles.formTitle}>{editingId ? 'Edit Address' : 'Add New Address'}</Text>
							<Pressable
								onPress={() => {
									setShowAddForm(false);
									setEditingId(null);
									setFormData({
										label: '',
										name: '',
										phone: '',
										street: '',
										area: '',
										city: '',
										postalCode: '',
									});
								}}>
								<IconSymbol
									name='xmark'
									size={24}
									color='#666666'
								/>
							</Pressable>
						</View>

						{/* Location Button */}
						<Pressable
							style={styles.locationButton}
							onPress={handleGetCurrentLocation}>
							<IconSymbol
								name='location.fill'
								size={20}
								color='#E63946'
							/>
							<Text style={styles.locationButtonText}>Use Current Location</Text>
						</Pressable>

						{/* Form Fields */}
						<View style={styles.formField}>
							<Text style={styles.label}>Label *</Text>
							<View style={styles.labelOptions}>
								{['Home', 'Office', 'Other'].map(label => (
									<Pressable
										key={label}
										style={[
											styles.labelOption,
											formData.label === label && styles.labelOptionActive,
										]}
										onPress={() => setFormData(prev => ({ ...prev, label }))}>
										<Text
											style={[
												styles.labelOptionText,
												formData.label === label && styles.labelOptionTextActive,
											]}>
											{label}
										</Text>
									</Pressable>
								))}
							</View>
						</View>

						<View style={styles.formField}>
							<Text style={styles.label}>Full Name *</Text>
							<TextInput
								style={styles.input}
								placeholder='Enter full name'
								value={formData.name}
								onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
							/>
						</View>

						<View style={styles.formField}>
							<Text style={styles.label}>Phone Number *</Text>
							<TextInput
								style={styles.input}
								placeholder='+880 1XXXXXXXXX'
								keyboardType='phone-pad'
								value={formData.phone}
								onChangeText={text => setFormData(prev => ({ ...prev, phone: text }))}
							/>
						</View>

						<View style={styles.formField}>
							<Text style={styles.label}>Street Address *</Text>
							<TextInput
								style={styles.input}
								placeholder='House/Flat no., Street'
								value={formData.street}
								onChangeText={text => setFormData(prev => ({ ...prev, street: text }))}
							/>
						</View>

						<View style={styles.formField}>
							<Text style={styles.label}>Area *</Text>
							<TextInput
								style={styles.input}
								placeholder='Area/Locality'
								value={formData.area}
								onChangeText={text => setFormData(prev => ({ ...prev, area: text }))}
							/>
						</View>

						<View style={styles.formRow}>
							<View style={[styles.formField, { flex: 1 }]}>
								<Text style={styles.label}>City *</Text>
								<TextInput
									style={styles.input}
									placeholder='City'
									value={formData.city}
									onChangeText={text => setFormData(prev => ({ ...prev, city: text }))}
								/>
							</View>

							<View style={[styles.formField, { flex: 1 }]}>
								<Text style={styles.label}>Postal Code</Text>
								<TextInput
									style={styles.input}
									placeholder='1200'
									keyboardType='numeric'
									value={formData.postalCode}
									onChangeText={text => setFormData(prev => ({ ...prev, postalCode: text }))}
								/>
							</View>
						</View>

						<Pressable
							style={styles.saveButton}
							onPress={handleSaveAddress}>
							<Text style={styles.saveButtonText}>
								{editingId ? 'Update Address' : 'Save Address'}
							</Text>
						</Pressable>
					</View>
				)}

				{/* Bottom Spacing */}
				<View style={{ height: 100 }} />
			</ScrollView>

			{/* Add Address Button */}
			{!showAddForm && (
				<View style={styles.bottomContainer}>
					<Pressable
						style={styles.addButton}
						onPress={() => setShowAddForm(true)}>
						<IconSymbol
							name='plus'
							size={20}
							color='#FFFFFF'
						/>
						<Text style={styles.addButtonText}>Add New Address</Text>
					</Pressable>
				</View>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
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
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	scrollView: {
		flex: 1,
	},
	addressesContainer: {
		padding: 16,
	},
	addressCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	defaultAddressCard: {
		borderColor: '#E63946',
		borderWidth: 2,
	},
	addressHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	addressLabelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	addressLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
	},
	defaultBadge: {
		backgroundColor: '#FEF2F2',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#E63946',
	},
	defaultBadgeText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#E63946',
	},
	addressActions: {
		flexDirection: 'row',
		gap: 8,
	},
	actionButton: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		backgroundColor: '#F5F5F5',
	},
	addressContent: {
		marginBottom: 12,
	},
	addressName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 6,
	},
	addressText: {
		fontSize: 14,
		color: '#666666',
		lineHeight: 20,
	},
	setDefaultButton: {
		alignSelf: 'flex-start',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E63946',
		backgroundColor: '#FEF2F2',
	},
	setDefaultText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#E63946',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 80,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#666666',
		marginTop: 16,
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: '#999999',
		marginTop: 8,
	},
	formContainer: {
		backgroundColor: '#FFFFFF',
		padding: 20,
		marginHorizontal: 16,
		marginBottom: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	formHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	formTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	locationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#FEF2F2',
		paddingVertical: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E63946',
		marginBottom: 20,
	},
	locationButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#E63946',
	},
	formField: {
		marginBottom: 16,
	},
	formRow: {
		flexDirection: 'row',
		gap: 12,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 8,
	},
	labelOptions: {
		flexDirection: 'row',
		gap: 8,
	},
	labelOption: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		backgroundColor: '#F5F5F5',
		alignItems: 'center',
	},
	labelOptionActive: {
		backgroundColor: '#E63946',
		borderColor: '#E63946',
	},
	labelOptionText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#666666',
	},
	labelOptionTextActive: {
		color: '#FFFFFF',
	},
	input: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
		fontSize: 15,
		color: '#000000',
		backgroundColor: '#F5F5F5',
	},
	saveButton: {
		backgroundColor: '#E63946',
		paddingVertical: 16,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 8,
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	bottomContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		paddingHorizontal: 20,
		paddingVertical: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#E63946',
		paddingVertical: 16,
		borderRadius: 12,
	},
	addButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
});
