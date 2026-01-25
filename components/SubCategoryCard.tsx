import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

const fallback = require('../assets/images/splash-icon.png');

type SubCategoryCardProps = {
	id: string;
	name: string;
	image?: string;
	onPress?: () => void;
};

export function SubCategoryCard({ id, name, image, onPress }: SubCategoryCardProps) {
	return (
		<TouchableOpacity
			style={styles.subcategoryCard}
			onPress={onPress}
			activeOpacity={0.7}>
			{image ? (
				<Image
					source={{ uri: image }}
					style={styles.subcategoryImage}
				/>
			) : (
				<Image
					source={fallback}
					style={styles.subcategoryImage}
				/>
			)}
			<Text style={styles.subcategoryName}>{name}</Text>
			<IconSymbol
				name='chevron.right'
				size={20}
				color='#333'
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	subcategoryCard: {
		flexDirection: 'row',
		alignItems: 'center',
		// backgroundColor: '#FAFAFA',
		padding: 0,
		borderRadius: 0,
		gap: 12,
	},
	subcategoryImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
	},
	subcategoryName: {
		flex: 1,
		fontSize: 16,
		fontWeight: '500',
		color: '#111',
	},
});
