import { Loader } from '@/components/Loader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetByIdQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { RootState } from '@/store';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
const fallback = require('../../../assets/images/fallback-fruit.png');

import { useToast } from '@/contexts/ToastContext';

export default function ProductDetailScreen() {
	const dispatch = useDispatch();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { showToast } = useToast();

	const { data: productD, isLoading } = useGetByIdQuery({
		path: 'products',
		id,
	});
	console.log('productD', productD);
	const product: any = productD ? productD : {};
	const [quantity, setQuantity] = useState(1);

	const favorites = useSelector((state: RootState) => state.favorites.items);
	const isFavorite = favorites.some(item => item.id === product.id);

	const handleBack = () => {
		router.back();
	};

	const handleIncrement = () => {
		setQuantity(prev => prev + 1);
	};

	const handleDecrement = () => {
		setQuantity(prev => (prev > 1 ? prev - 1 : 1));
	};

	const handleAddToCart = () => {
		dispatch(
			addToCart({
				item: {
					id: product?.id,
					_id: product?.id,
					name: product?.name,
					price: product?.price,
					image: product?.image || null,
					vat: 0,
				},
				qty: quantity,
			})
		);
		showToast('Added to cart');
	};

	const handleFavoritePress = () => {
		const willBeFavorite = !isFavorite;
		dispatch(
			toggleFavorite({
				id: product.id,
				name: product.name,
				price: product.sellPrice || product.price, // Handle different price fields if necessary
				image: product.image,
				unit: product.unit,
				unitPrice: product.unitPrice,
			})
		);
		showToast(willBeFavorite ? 'Added to favorites' : 'Removed from favorites');
	};

	// Ensure product.price is parsed safely (handles numbers or strings with commas)
	const priceNumber =
		parseFloat(String(product?.price ?? '0').replace(/,/g, '')) || 0;
	const totalPrice = (priceNumber * quantity).toLocaleString();
	if (isLoading) {
		return <Loader />;
	}
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				{/* Scrollable Content */}
				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContent}
				>
					{/* Product Image */}
					<View style={styles.imageContainer}>
						{product.image ? (
							<Image
								source={{ uri: product.image }}
								style={styles.image}
								resizeMode='contain'
							/>
						) : (
							<Image
								source={fallback}
								style={styles.image}
								resizeMode='contain'
							/>
						)}
						{product.discount > 0 && (
							<View style={styles.discountBadge}>
								<Text style={styles.discountText}>{product.discount}</Text>
							</View>
						)}
						{/* Overlay Buttons */}
						<TouchableOpacity
							style={styles.backButton}
							onPress={handleBack}
							activeOpacity={0.7}
						>
							<IconSymbol name='chevron.left' size={24} color='#000' />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.favoriteButton}
							activeOpacity={0.7}
							onPress={handleFavoritePress}
						>
							<IconSymbol
								name={isFavorite ? 'heart.fill' : 'heart'}
								size={24}
								color={isFavorite ? '#E63946' : '#000'}
							/>
						</TouchableOpacity>
					</View>

					{/* Product Info */}
					<View style={styles.infoSection}>
						{product.category && (
							<Text style={styles.category}>{product.category.name}</Text>
						)}
						<Text style={styles.productName}>{product.name}</Text>

						<Text style={styles.unit}>
							{product.weight || 'N/A'} {product.unit || 'N/A'}
						</Text>

						<View style={styles.priceContainer}>
							<Text style={styles.price}>৳{product.sellPrice}</Text>
							{product.price && (
								<Text style={styles.originalPrice}>৳{product.oldPrice}</Text>
							)}
						</View>

						{product.badge !== undefined && (
							<View style={styles.badgeContainer}>
								<IconSymbol name='sparkles' size={14} color='#E63946' />
								<Text style={styles.badgeText}>{product.badge}</Text>
							</View>
						)}
					</View>

					{/* Description */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Description</Text>
						<Text style={styles.description}>{product.description}</Text>
					</View>

					{/* Ingredients */}
					{product.ingredients && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Ingredients</Text>
							<Text style={styles.description}>{product.ingredients}</Text>
						</View>
					)}

					{/* Nutrition Information */}
					{product.nutritionPer100ml && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>
								Nutrition Information (per 100ml)
							</Text>
							<View style={styles.nutritionTable}>
								{Object.entries(product.nutritionPer100ml).map(
									([key, value]) => (
										<View key={key} style={styles.nutritionRow}>
											<Text style={styles.nutritionKey}>
												{key.charAt(0).toUpperCase() + key.slice(1)}
											</Text>
											<Text style={styles.nutritionValue}>
												{value as string}
											</Text>
										</View>
									),
								)}
							</View>
						</View>
					)}

					{product.nutritionPer100g && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>
								Nutrition Information (per 100g)
							</Text>
							<View style={styles.nutritionTable}>
								{Object.entries(product.nutritionPer100g).map(
									([key, value]) => (
										<View key={key} style={styles.nutritionRow}>
											<Text style={styles.nutritionKey}>
												{key.charAt(0).toUpperCase() + key.slice(1)}
											</Text>
											<Text style={styles.nutritionValue}>
												{value as string}
											</Text>
										</View>
									),
								)}
							</View>
						</View>
					)}

					{/* Origin */}
					{product.origin && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Origin</Text>
							<Text style={styles.description}>{product.origin}</Text>
						</View>
					)}

					{/* Spacer for bottom bar */}
					<View style={{ height: 100 }} />
				</ScrollView>

				{/* Bottom Add to Cart Bar */}
				<View style={styles.bottomBar}>
					<View style={styles.quantitySelector}>
						<TouchableOpacity
							style={styles.quantityButton}
							onPress={handleDecrement}
							activeOpacity={0.7}
						>
							<IconSymbol name='minus' size={20} color='#E63946' />
						</TouchableOpacity>
						<Text style={styles.quantityText}>{quantity}</Text>
						<TouchableOpacity
							style={styles.quantityButton}
							onPress={handleIncrement}
							activeOpacity={0.7}
						>
							<IconSymbol name='plus' size={20} color='#E63946' />
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.addToCartButton}
						onPress={handleAddToCart}
						activeOpacity={0.8}
					>
						<IconSymbol name='cart.fill' size={20} color='#FFF' />
						<Text style={styles.addToCartText}>Add ৳{totalPrice}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	backButton: {
		position: 'absolute',
		top: 16,
		left: 16,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
		zIndex: 10,
	},
	favoriteButton: {
		position: 'absolute',
		top: 16,
		right: 16,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
		zIndex: 10,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 20,
	},
	imageContainer: {
		width: '100%',
		height: 420,
		backgroundColor: '#F5F5F5',
		position: 'relative',
	},
	image: {
		width: '100%',
		height: 420,
		objectFit: 'cover',
	},
	discountBadge: {
		position: 'absolute',
		top: 16,
		left: 16,
		backgroundColor: '#FFD700',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	discountText: {
		fontSize: 14,
		fontWeight: '700',
		color: '#000',
	},
	infoSection: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	category: {
		fontSize: 12,
		color: '#666',
		marginBottom: 4,
	},
	productName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 8,
	},
	unit: {
		fontSize: 14,
		color: '#666',
		marginBottom: 12,
	},
	priceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 8,
	},
	price: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#E63946',
	},
	originalPrice: {
		fontSize: 18,
		color: '#999',
		textDecorationLine: 'line-through',
	},
	badgeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 8,
	},
	badgeText: {
		fontSize: 12,
		color: '#E63946',
		fontWeight: '600',
	},
	section: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 12,
	},
	description: {
		fontSize: 14,
		lineHeight: 22,
		color: '#333',
	},
	nutritionTable: {
		gap: 8,
	},
	nutritionRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#F5F5F5',
	},
	nutritionKey: {
		fontSize: 14,
		color: '#666',
	},
	nutritionValue: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
	},
	bottomBar: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 20,
		paddingVertical: 8,
		paddingBottom: Platform.OS === 'ios' ? 20 : 8,
		backgroundColor: '#FFFFFF',
	},
	quantitySelector: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F5F5F5',
		borderRadius: 24,
		paddingHorizontal: 8,
		paddingVertical: 8,
		gap: 16,
	},
	quantityButton: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#FFF',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	quantityText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
		minWidth: 24,
		textAlign: 'center',
	},
	addToCartButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E63946',
		borderRadius: 24,
		paddingVertical: 14,
		gap: 8,
		shadowColor: '#E63946',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 4,
	},
	addToCartText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFF',
	},
});
