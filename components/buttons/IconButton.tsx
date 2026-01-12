'use client';
import { FC } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';
import { CustomColors } from '@/constants/theme';

/**
 * @description
 * @version 1.0.0
 * @author arefin-aareef
 * @gitHub https://github.com/arefin-aareef
 * @linkedIn https://linkedin.com/in/arefin-aareef
 * */

type IconButtonProps = {
	onPress: () => any;
	icon: any;
	loading?: boolean;
};

const IconButton: FC<IconButtonProps> = ({ onPress, icon, loading }) => {
	return (
		<Pressable onPress={onPress} style={styles.actionButton} disabled={loading}>
			{loading ? (
				<ActivityIndicator size='small' color='#FFFFFF' />
			) : (
				<IconSymbol name={icon} size={18} color={CustomColors.darkBrown} />
			)}
		</Pressable>
	);
};

export default IconButton;

const styles = StyleSheet.create({
	actionButton: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		backgroundColor: CustomColors.lightBrown,
		// borderColor: CustomColors.darkBrown,
		// borderWidth: 1,
	},
});
