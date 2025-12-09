import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';
import { Toast } from './ui/Toast';

const fallback = require('../assets/images/fallback-fruit.png');

type ProductCardProps = {
	id: string;
	name: string;
	price: string;
	unit?: string;
	unitPrice?: string;
	badge?: string;
	badgeIcon?: string;
	image: string | number; // Can be URI string or require() number
	onPress?: () => void;
	onAddPress?: () => void;
};

export function ProductCard({
	name,
	price,
	unit,
	unitPrice,
	badge,
	badgeIcon,
	image,
	onPress,
	onAddPress,
}: ProductCardProps) {
	// Determine if image is a URI or local require
	const imageSource = typeof image === 'string' ? { uri: image } : image;

	const [showToast, setShowToast] = useState(false);

	const handleAdd = () => {
		onAddPress?.();
		setShowToast(true);
	};

	return (
		<>
			<TouchableOpacity
				style={styles.card}
				onPress={onPress}
				activeOpacity={0.7}
			>
				<View style={styles.imageContainer}>
					<Image
						source={imageSource || fallback}
						style={styles.image}
						resizeMode='contain'
					/>
					<TouchableOpacity
						style={styles.addButton}
						onPress={handleAdd}
						activeOpacity={0.8}
					>
						<IconSymbol name='plus' size={20} color='#E63946' />
					</TouchableOpacity>
				</View>

				{badge && (
					<View style={styles.badgeContainer}>
						{badgeIcon && (
							<IconSymbol name={badgeIcon as any} size={12} color='#E63946' />
						)}
						<Text style={styles.badgeText}>{badge}</Text>
					</View>
				)}

				<View style={styles.info}>
					<Text style={styles.name} numberOfLines={2}>
						{name}
					</Text>
					<Text style={styles.price}>৳{price}</Text>
					{unit && unitPrice && (
						<Text style={styles.unitPrice}>
							{unit} · {unitPrice}
						</Text>
					)}
				</View>
			</TouchableOpacity>
			<Toast
				message='Added to cart'
				visible={showToast}
				onDismiss={() => setShowToast(false)}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	card: {
		minWidth: 180,
		maxWidth: 220,
		backgroundColor: '#FFF',
		borderRadius: 12,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	imageContainer: {
		width: '100%',
		height: 140,
		backgroundColor: '#F5F5F5',
		position: 'relative',
		padding: 10,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	addButton: {
		position: 'absolute',
		bottom: 8,
		right: 8,
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#FFF',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	badgeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingTop: 8,
		gap: 4,
	},
	badgeText: {
		fontSize: 11,
		color: '#E63946',
		fontWeight: '500',
	},
	info: {
		padding: 12,
		gap: 4,
	},
	name: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
		lineHeight: 18,
		minHeight: 36,
	},
	price: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000',
		marginTop: 4,
	},
	unitPrice: {
		fontSize: 11,
		color: '#666',
		marginTop: 2,
	},
});
