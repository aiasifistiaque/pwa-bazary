import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

type PromoBannerProps = {
	title: string;
	description: string;
	couponCode?: string;
	image: string;
	onPress?: () => void;
};

export function PromoBanner({ title, description, couponCode, image, onPress }: PromoBannerProps) {
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			activeOpacity={0.9}>
			<ImageBackground
				source={{ uri: image }}
				style={styles.background}
				imageStyle={styles.backgroundImage}>
				{couponCode && (
					<View style={styles.couponBadge}>
						<Text style={styles.couponLabel}>CODE:</Text>
						<Text style={styles.couponCode}>{couponCode}</Text>
					</View>
				)}

				<View style={styles.content}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.subtitle}>{description}</Text>
				</View>

				<View style={styles.giftIcons}>
					<View style={styles.giftBox}>
						<IconSymbol
							name='gift.fill'
							size={24}
							color='#E63946'
						/>
						<Text style={styles.giftLabel}>1. Order</Text>
					</View>
					<View style={styles.giftBox}>
						<IconSymbol
							name='gift.fill'
							size={24}
							color='#E63946'
						/>
						<Text style={styles.giftLabel}>2. Order</Text>
					</View>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 12,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	background: {
		width: '100%',
		height: 180,
		justifyContent: 'space-between',
		padding: 16,
	},
	backgroundImage: {
		borderRadius: 12,
	},
	couponBadge: {
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		gap: 4,
	},
	couponLabel: {
		fontSize: 12,
		fontWeight: '600',
		color: '#333',
	},
	couponCode: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#E63946',
	},
	content: {
		gap: 4,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#FFFFFF',
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	subtitle: {
		fontSize: 14,
		color: '#FFFFFF',
		fontWeight: '500',
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	giftIcons: {
		position: 'absolute',
		right: 16,
		top: 60,
		gap: 12,
	},
	giftBox: {
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		padding: 8,
		borderRadius: 8,
		alignItems: 'center',
		gap: 4,
		minWidth: 70,
	},
	giftLabel: {
		fontSize: 10,
		fontWeight: '600',
		color: '#333',
	},
});
