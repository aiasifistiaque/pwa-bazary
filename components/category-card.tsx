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
			<View style={styles.overlay}>
				<Text style={styles.name} numberOfLines={2}>
					{name}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: '23%',
		aspectRatio: 1,
		backgroundColor: '#F5F5F5',
		borderRadius: 12,
		marginBottom: 12,
		overflow: 'hidden',
		position: 'relative',
		borderWidth: 0,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	image: {
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
	overlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.4)',
		paddingVertical: 4,
		paddingHorizontal: 2,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 28,
	},
	name: {
		fontSize: 10,
		fontWeight: '600',
		color: '#FFFFFF',
		textAlign: 'center',
		lineHeight: 12,
	},
});
