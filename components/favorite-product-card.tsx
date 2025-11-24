import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

type FavoriteProductCardProps = {
	id: string;
	name: string;
	category?: any;
	price: string;
	originalPrice?: string;
	unit?: string;
	unitPrice?: string;
	badge?: string;
	discount?: number;
	// discount?: string | number;
	image: string | number;
	onPress?: () => void;
	onAddPress?: () => void;
};
const fallback = require('../assets/images/fallback-fruit.png');

export function FavoriteProductCard({
	name,
	category,
	price,
	originalPrice,
	unit,
	unitPrice,
	badge,
	discount = 0,
	image,
	onPress,
	onAddPress,
}: FavoriteProductCardProps) {
	const imageSource = typeof image === 'string' ? { uri: image } : image;
	
	return (
		<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
			<View style={styles.imageContainer}>
				<Image
					source={imageSource || fallback}
					style={styles.image}
					resizeMode='cover'
				/>
				{discount > 0 && (
					<View style={styles.discountBadge}>
						<Text style={styles.discountText}>{discount}</Text>
					</View>
				)}

				{badge !== undefined && (
					<View style={styles.priceBadge}>
						<Text style={styles.priceBadgeText}>{'badge'}</Text>
					</View>
				)}
				<TouchableOpacity
					style={styles.addButton}
					onPress={onAddPress}
					activeOpacity={0.8}
				>
					<IconSymbol name='plus' size={20} color='#E63946' />
				</TouchableOpacity>
			</View>

			<View style={styles.info}>
				{name && (
					<Text style={styles.category}>{name}</Text>
				)}
				<View style={styles.nameContainer}>
					<Text style={styles.name} numberOfLines={1}>
						{category?.name}
					</Text>
					<IconSymbol name='chevron.right' size={14} color='#333' />
				</View>
				<View style={styles.priceContainer}>
					<Text style={styles.price}>৳{price}</Text>
					{originalPrice && (
						<Text style={styles.originalPrice}>৳{originalPrice}</Text>
					)}
				</View>
				{unit && unitPrice && (
					<Text style={styles.unitInfo}>
						{unit} · {unitPrice}
					</Text>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: '48%',
		backgroundColor: '#FFF',
		borderRadius: 12,
		marginBottom: 16,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	imageContainer: {
		width: '100%',
		height: 160,
		backgroundColor: '#F5F5F5',
		position: 'relative',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	discountBadge: {
		position: 'absolute',
		top: 8,
		left: 8,
		backgroundColor: '#FFD700',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
	},
	discountText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#000',
	},
	priceBadge: {
		position: 'absolute',
		bottom: 8,
		left: 8,
		backgroundColor: '#FFD700',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 6,
	},
	priceBadgeText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#000',
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
	info: {
		padding: 12,
		gap: 4,
	},
	category: {
		fontSize: 11,
		color: '#666',
		marginBottom: 2,
	},
	nameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 4,
	},
	name: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
		flex: 1,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginTop: 4,
	},
	price: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#E63946',
	},
	originalPrice: {
		fontSize: 13,
		color: '#999',
		textDecorationLine: 'line-through',
	},
	unitInfo: {
		fontSize: 11,
		color: '#666',
		marginTop: 2,
	},
});
