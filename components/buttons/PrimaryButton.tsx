import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import React from 'react';
import {
	ActivityIndicator,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	ViewStyle,
} from 'react-native';

type PrimaryButtonProps = {
	title: string;
	onPress: () => void;
	icon?: React.ComponentProps<typeof IconSymbol>['name'];
	loading?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({
	title,
	onPress,
	icon,
	loading = false,
	disabled = false,
	style,
}: PrimaryButtonProps) {
	return (
		<Pressable
			style={[styles.button, disabled && styles.disabled, style]}
			onPress={onPress}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator size='small' color={CustomColors.darkBrown} />
			) : (
				<>
					{icon && (
						<IconSymbol name={icon} size={20} color={CustomColors.darkBrown} />
					)}
					<Text style={styles.text}>{title}</Text>
				</>
			)}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 24,
		gap: 12,
		// borderBottomWidth: 4,
		// borderRightWidth: 4,
		// borderColor: CustomColors.darkBrown,
	},
	disabled: {
		opacity: 0.6,
	},
	text: {
		fontSize: 16,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
	},
});
