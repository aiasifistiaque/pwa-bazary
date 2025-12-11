'use client';
import { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';
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
};

const IconButton: FC<IconButtonProps> = ({ onPress, icon }) => {
	return (
		<Pressable onPress={onPress} style={styles.actionButton}>
			<IconSymbol name={icon} size={18} color={CustomColors.darkBrown} />
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
		borderColor: CustomColors.darkBrown,
		borderWidth: 1,
	},
});
