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

export function CategoryCard({ name, image, onPress }: CategoryCardProps) {
	const [imgErr, setImgErr] = useState(false);
	const hasImg = image && !imgErr;

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<View style={styles.imageContainer}>
				<Image
					source={hasImg ? { uri: image } : fallbackImg}
					style={styles.image}
					resizeMode='cover'
					onError={() => setImgErr(true)}
				/>
			</View>
			<Text style={styles.name} numberOfLines={2}>
				{name}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '23%',
		marginBottom: 16,
		alignItems: 'center',
	},
	imageContainer: {
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#F5F5F5',
		borderRadius: 12,
		marginBottom: 8,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#EEE',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	name: {
		fontSize: 12,
		fontWeight: '500',
		color: '#1F2937',
		textAlign: 'center',
		lineHeight: 16,
		paddingHorizontal: 2,
	},
});
