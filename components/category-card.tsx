import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const fallbackImg = require('../assets/images/fallback-fruit.png');
type CategoryCardProps = {
	id: string;
	name: string;
	icon?: string;
	image?: string;
	onPress?: () => void;
};

export function CategoryCard({
	name,
	icon,
	image,
	onPress,
}: CategoryCardProps) {
	const [imgErr, setImgErr] = useState(false);
	const hasImg = image && !imgErr;
	return (
		<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
			<View style={styles.iconContainer}>
				{hasImg ? (
					<Image
						source={{ uri: image }}
						style={styles.image}
						resizeMode='cover'
						onError={() => setImgErr(true)}
					/>
				) : (
					<Image
						source={fallbackImg}
						style={styles.image}
						resizeMode='cover'
						onError={() => setImgErr(true)}
					/>
				)}
			</View>
			<Text style={styles.name} numberOfLines={2}>
				{name}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: '23%',
		aspectRatio: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 8,
		marginBottom: 12,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	iconContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#FFF5F5',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 8,
	},
	image: {
		width: 48,
		height: 48,
		borderRadius: 24,
	},
	name: {
		fontSize: 11,
		fontWeight: '600',
		color: '#333',
		textAlign: 'center',
		lineHeight: 14,
	},
});
