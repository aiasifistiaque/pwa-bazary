'use client';
import { FC } from 'react';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Address } from '@/store/slices/addressSlice';
import { CustomColors } from '@/constants/theme';
import IconButton from '../buttons/IconButton';

/**
 * @description Address card component
 * @version 1.0.0
 * @author arefin-aareef
 * @gitHub https://github.com/arefin-aareef
 * @linkedIn https://linkedin.com/in/arefin-aareef
 * */

type AddressCardProps = {
	address: Address;
	handleEdit: (address: Address) => void;
	handleDelete: (id: string) => void;
	handleSetDefault: (id: string) => void;
	settingDefaultId: string | null;
};

const AddressCard: FC<AddressCardProps> = ({
	address,
	handleEdit,
	handleDelete,
	handleSetDefault,
	settingDefaultId,
}) => {
	return (
		<View
			key={address.id || (address as any)._id}
			style={[
				styles.addressCard,
				address.isDefault && styles.defaultAddressCard,
			]}
		>
			<View style={styles.addressHeader}>
				<View style={styles.addressLabelContainer}>
					<IconSymbol
						name={address.label === 'Home' ? 'house.fill' : 'building.2.fill'}
						size={20}
						color={CustomColors.darkBrown}
					/>
					<Text style={styles.addressLabel}>{address.label}</Text>
					{address.isDefault && (
						<View style={styles.defaultBadge}>
							<Text style={styles.defaultBadgeText}>Default</Text>
						</View>
					)}
				</View>
				<View style={styles.addressActions}>
					<IconButton onPress={() => handleEdit(address)} icon='pencil' />
					<IconButton
						onPress={() => handleDelete(address.id || (address as any)._id)}
						icon='trash'
					/>
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
					style={[
						styles.setDefaultButton,
						settingDefaultId === (address.id || (address as any)._id) &&
							styles.setDefaultButtonDisabled,
					]}
					onPress={() => handleSetDefault(address.id || (address as any)._id)}
					disabled={settingDefaultId !== null}
				>
					{settingDefaultId === (address.id || (address as any)._id) ? (
						<ActivityIndicator size='small' color={CustomColors.darkBrown} />
					) : (
						<Text style={styles.setDefaultText}>Set as Default</Text>
					)}
				</Pressable>
			)}
		</View>
	);
};

export default AddressCard;

const styles = StyleSheet.create({
	addressCard: {
		backgroundColor: CustomColors.cardBgColor,
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: CustomColors.lightBrown,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	defaultAddressCard: {
		borderColor: CustomColors.darkBrown,
		borderWidth: 2,
	},
	addressHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: CustomColors.lightBrown,
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
		backgroundColor: CustomColors.lightBrown,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		// borderWidth: 1,
		// borderColor: CustomColors.darkBrown,
	},
	defaultBadgeText: {
		fontSize: 11,
		fontWeight: '600',
		color: CustomColors.darkBrown,
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
		backgroundColor: CustomColors.lightBrown,
		borderColor: CustomColors.darkBrown,
		borderWidth: 1,
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
		minWidth: 130,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		// borderWidth: 1,
		// borderColor: CustomColors.darkBrown,
		backgroundColor: CustomColors.lightBrown,
	},
	setDefaultButtonDisabled: {
		opacity: 0.5,
	},
	setDefaultText: {
		fontSize: 13,
		fontWeight: '600',
		color: CustomColors.darkBrown,
	},
});
