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
	Modal,
	Platform,
	ScrollView,
	Share,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	FlatList,
	Dimensions,
} from 'react-native';
const { width } = Dimensions.get('window');
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
const fallback = require('../../../assets/images/fallback-fruit.png');

import { useToast } from '@/contexts/ToastContext';
import { CustomColors } from '@/constants/theme';

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
	const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

	const handleShare = async () => {
		try {
			await Share.share({
				message: `Check out ${product.name} on Bazarey! Price: ৳${product.sellPrice}. ${product.shortDescription || ''}`,
				url: `https://bazarey.com/product/${product.id}`,
			});
		} catch (error) {
			console.error(error);
		}
	};

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
			}),
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
				weight: product.weight || product.unitValue,
			}),
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
								color={isFavorite ? CustomColors.darkBrown : '#000'}
							/>
						</TouchableOpacity>
					</View>

					{/* Product Info */}
					<View style={styles.infoSection}>
						{product.category && (
							<Text style={styles.category}>{product.category.name}</Text>
						)}
						<View style={styles.nameHeader}>
							<Text style={[styles.productName, { flex: 1 }]}>
								{product.name}
							</Text>
							<TouchableOpacity
								onPress={handleShare}
								style={styles.shareButton}
							>
								<IconSymbol name='square.and.arrow.up' size={24} color='#666' />
							</TouchableOpacity>
						</View>

						<View style={styles.unitRow}>
							<Text style={styles.unit}>
								{product.weight || product.unitValue || '000'}{' '}
								{product.unit || 'unit'}
							</Text>
							{product.stock !== undefined && (
								<View
									style={[
										styles.stockBadge,
										product.stock > 0 ? styles.inStock : styles.outOfStock,
									]}
								>
									<Text
										style={[
											styles.stockText,
											product.stock > 0
												? styles.inStockText
												: styles.outOfStockText,
										]}
									>
										{product.stock > 0
											? `${product.stock} items left`
											: 'Sold Out'}
									</Text>
								</View>
							)}
						</View>

						<View style={[styles.priceContainer, { flexWrap: 'wrap' }]}>
							<Text style={styles.price}>
								{`৳${
									product.isDiscount
										? product.discountedPrice
										: product.sellPrice
								}`}
							</Text>
							{product.oldPrice && (
								<Text style={styles.originalPrice}>৳{product.oldPrice}</Text>
							)}
							{product.isDiscount && product.discount > 0 && (
								<View style={styles.saveBadge}>
									<Text style={styles.saveBadgeText}>
										Save ৳{product.discount}
									</Text>
								</View>
							)}
						</View>

						{product.shortDescription && (
							<Text style={styles.shortDescription}>
								{product.shortDescription}
							</Text>
						)}

						{product.badge !== undefined && (
							<View style={styles.badgeContainer}>
								<IconSymbol name='sparkles' size={14} color='#E63946' />
								<Text style={styles.badgeText}>{product.badge}</Text>
							</View>
						)}
					</View>

					{/* Description */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>More about the product</Text>
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

					{/* More Images */}
					{product.images && product.images.length > 0 && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>More Images</Text>
							<View style={styles.imageGrid}>
								{product.images.map((img: string, index: number) => (
									<TouchableOpacity
										key={index}
										style={styles.gridImageContainer}
										onPress={() => setActiveImageIndex(index)}
									>
										<Image source={{ uri: img }} style={styles.gridImage} />
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					{/* Image Preview Modal */}
					<Modal
						visible={activeImageIndex !== null}
						transparent={true}
						onRequestClose={() => setActiveImageIndex(null)}
					>
						<View style={styles.modalBackground}>
							<TouchableOpacity
								style={styles.closeModalButton}
								onPress={() => setActiveImageIndex(null)}
							>
								<IconSymbol name='xmark' size={24} color='#FFF' />
							</TouchableOpacity>

							{activeImageIndex !== null && (
								<View style={styles.modalContent}>
									<TouchableOpacity
										style={[styles.navButton, styles.prevButton]}
										onPress={() =>
											setActiveImageIndex(prev =>
												prev! > 0 ? prev! - 1 : product.images.length - 1,
											)
										}
									>
										<IconSymbol name='chevron.left' size={30} color='#FFF' />
									</TouchableOpacity>

									<Image
										source={{ uri: product.images[activeImageIndex] }}
										style={styles.fullImage}
										resizeMode='contain'
									/>

									<TouchableOpacity
										style={[styles.navButton, styles.nextButton]}
										onPress={() =>
											setActiveImageIndex(prev =>
												prev! < product.images.length - 1 ? prev! + 1 : 0,
											)
										}
									>
										<IconSymbol name='chevron.right' size={30} color='#FFF' />
									</TouchableOpacity>
								</View>
							)}
						</View>
					</Modal>

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
							<IconSymbol
								name='minus'
								size={20}
								color={CustomColors.darkBrown}
							/>
						</TouchableOpacity>
						<Text style={styles.quantityText}>{quantity}</Text>
						<TouchableOpacity
							style={styles.quantityButton}
							onPress={handleIncrement}
							activeOpacity={0.7}
						>
							<IconSymbol
								name='plus'
								size={20}
								color={CustomColors.darkBrown}
							/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						style={styles.addToCartButton}
						onPress={handleAddToCart}
						activeOpacity={0.8}
					>
						<IconSymbol
							name='cart.fill'
							size={20}
							color={CustomColors.darkBrown}
						/>
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
		color: CustomColors.darkBrown,
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
	nameHeader: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		gap: 12,
		marginBottom: 8,
	},
	shareButton: {
		padding: 4,
	},
	unitRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		marginBottom: 12,
	},
	stockBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
	},
	inStock: {
		backgroundColor: '#E8F5E9',
	},
	outOfStock: {
		backgroundColor: '#FFEBEE',
	},
	stockText: {
		fontSize: 12,
		fontWeight: '600',
	},
	inStockText: {
		color: '#2E7D32',
	},
	outOfStockText: {
		color: '#C62828',
	},
	saveBadge: {
		backgroundColor: '#5bab6dff',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	saveBadgeText: {
		color: '#FFF',
		fontSize: 12,
		fontWeight: 'bold',
	},
	shortDescription: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
		marginBottom: 16,
	},
	imageGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	gridImageContainer: {
		width: (width - 52) / 2,
		aspectRatio: 1,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#F5F5F5',
	},
	gridImage: {
		width: '100%',
		height: '100%',
	},
	modalBackground: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.9)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	closeModalButton: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 60 : 40,
		right: 20,
		zIndex: 10,
		padding: 8,
	},
	fullImage: {
		width: width,
		height: '100%',
	},
	navButton: {
		position: 'absolute',
		zIndex: 20,
		padding: 10,
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 25,
	},
	prevButton: {
		left: 20,
	},
	nextButton: {
		right: 20,
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
		borderRadius: 28,
		paddingHorizontal: 8,
		height: 56,
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
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 28,
		height: 56,
		gap: 8,
		shadowColor: CustomColors.lightBrown,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 4,
	},
	addToCartText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
	},
});
