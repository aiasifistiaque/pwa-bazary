import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

type DeliveryTimeButtonProps = {
	text: string;
	onPress?: () => void;
};

export function DeliveryTimeButton({ text, onPress }: DeliveryTimeButtonProps) {
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			activeOpacity={0.7}>
			<Text style={styles.text}>{text}</Text>
			<IconSymbol
				name='chevron.right'
				size={16}
				color='#2D6A4F'
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#D8F3DC',
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginHorizontal: 16,
		marginTop: 12,
		marginBottom: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#95D5B2',
	},
	text: {
		fontSize: 14,
		fontWeight: '600',
		color: '#2D6A4F',
		flex: 1,
	},
});
