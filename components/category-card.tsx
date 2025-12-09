import React, { useState } from 'react';
import {
	ImageBackground,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

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
	console.log('image', image);

	return (
		<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
			<ImageBackground
				source={hasImg ? { uri: image } : fallbackImg}
				style={styles.imageBackground}
				imageStyle={styles.imageStyle}
				resizeMode='cover'
				onError={() => setImgErr(true)}
			>
				<View style={styles.overlay}>
					<Text style={styles.name} numberOfLines={2}>
						{name}
					</Text>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: '23%',
		aspectRatio: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
		overflow: 'hidden',
		padding: 0,
	},
	imageBackground: {
		width: '100%',
		height: '100%',
		justifyContent: 'flex-end',
	},
	imageStyle: {
		borderRadius: 12,
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		paddingVertical: 6,
		paddingHorizontal: 4,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomLeftRadius: 12,
		borderBottomRightRadius: 12,
	},
	name: {
		fontSize: 11,
		fontWeight: '600',
		color: '#FFFFFF',
		textAlign: 'center',
		lineHeight: 14,
		minHeight: 28, // Reserve space for 2 lines
		textAlignVertical: 'center', // For Android vertical centering if needed, though mostly for Input
	},
});
