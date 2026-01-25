import React from 'react';
import {
	Image,
	LayoutAnimation,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	UIManager,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IconSymbol } from './ui/icon-symbol';
import { useToast } from '@/contexts/ToastContext';
import { RootState } from '@/store';
import { addToCart, deleteOneFromCart } from '@/store/slices/cartSlice';
import { CustomColors } from '@/constants/theme';

const fallback = require('../assets/images/fallback-fruit.png');

if (
	Platform.OS === 'android' &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ProductCardProps = {
	product: any;
	id: string;
	name: string;
	price: string | number;
	unit?: string;
	unitPrice?: string;
	badge?: string;
	badgeIcon?: string;
	weight?: string;
	image: string | number; // Can be URI string or require() number
	onPress?: () => void;
	/**
	 * @deprecated onAddPress is now handled internally via Redux,
	 * but kept for compatibility or additional side effects if needed.
	 */
	onAddPress?: () => void;
};

export function ProductCard({
	product,
	id,
	name,
	price,
	unit,
	unitPrice,
	weight,
	badge,
	badgeIcon,
	image,
	onPress,
	onAddPress,
}: ProductCardProps) {
	// Determine if image is a URI or local require
	const imageSource = typeof image === 'string' ? { uri: image } : image;

	const { showToast } = useToast();
	const dispatch = useDispatch();

	const cartItems = useSelector((state: RootState) => state.cart.cartItems);

	// Construct uniqueId assuming default variant (no-size-no-color)
	// This matches the logic in cartSlice for items without variationId or selected options
	const uniqueId = `${id}-no-size-no-color`;
	const cartItem = cartItems.find((item: any) => item.uniqueId === uniqueId);
	const quantity = cartItem ? cartItem.qty : 0;

	const handleIncrement = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		if (onAddPress) {
			onAddPress();
		} else {
			dispatch(
				addToCart({
					item: {
						id,
						_id: id,
						name: product?.name || name,
						price:
							typeof price === 'string'
								? parseFloat(price.replace(/[^0-9.]/g, ''))
								: product?.sellPrice || price, // Ensure price is number
						image,
						vat: 0,
					},
					qty: 1,
				}),
			);
		}

		showToast('Added to cart');
	};

	const handleDecrement = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		dispatch(deleteOneFromCart(uniqueId));
	};

	return (
		<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
			<View style={styles.imageContainer}>
				<Image
					source={imageSource || fallback}
					style={styles.image}
					resizeMode='cover'
				/>

				{/* Expanding Button Container */}
				<View
					style={[
						styles.buttonContainer,
						quantity > 0 && styles.buttonContainerExpanded,
					]}
				>
					{quantity > 0 && (
						<>
							<TouchableOpacity
								onPress={handleDecrement}
								style={styles.iconButton}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
							>
								<IconSymbol
									name='minus'
									size={18}
									color={CustomColors.darkBrown}
								/>
							</TouchableOpacity>

							<Text style={styles.quantityText}>{quantity}</Text>
						</>
					)}

					<TouchableOpacity
						onPress={handleIncrement}
						style={styles.iconButton}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					>
						<IconSymbol name='plus' size={20} color={CustomColors.darkBrown} />
					</TouchableOpacity>
				</View>
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
					{product?.name || name}
				</Text>
				<Text style={styles.unitPrice}>
					{`${product?.weight || product?.unitValue || weight || '000'} ${product?.unit || unit || 'unit'}`}
					{product?.unitPrice || unitPrice
						? ` · ${product?.unitPrice || unitPrice}`
						: ''}
				</Text>
				<Text style={styles.price}>
					৳
					{product?.discountedPrice ||
						product?.sellPrice ||
						product?.price ||
						price}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		minWidth: 160,
		width: '100%',
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
		aspectRatio: 1,
		backgroundColor: '#F5F5F5',
		position: 'relative',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	// New Button Styles
	buttonContainer: {
		position: 'absolute',
		bottom: 8,
		right: 8,
		height: 32,
		minWidth: 32,
		borderRadius: 16,
		backgroundColor: '#FFF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		paddingHorizontal: 0,
	},
	buttonContainerExpanded: {
		paddingHorizontal: 4,
		minWidth: 90, // Minimum width when expanded
		justifyContent: 'space-between',
	},
	iconButton: {
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
	quantityText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
		marginHorizontal: 4,
		minWidth: 16,
		textAlign: 'center',
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
		color: CustomColors.darkBrown,
		marginTop: 4,
	},
	unitPrice: {
		fontSize: 11,
		color: '#666',
		marginTop: 2,
	},
});
