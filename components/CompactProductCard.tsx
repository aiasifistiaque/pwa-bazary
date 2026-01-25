import { CustomColors } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { RootState } from '@/store';
import { addToCart, removeFromCart, updateCartItemQuantity } from '@/store/slices/cartSlice';
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

const fallback = require('../assets/images/fallback-fruit.png');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CompactProductCardProps = {
	product: any;
	id: string;
	name: string;
	price: string | number;
	unit?: string;
	unitPrice?: string;
	badge?: string;
	badgeIcon?: string;
	weight?: string;
	image: string | number;
	onPress?: () => void;
};

export function CompactProductCard({
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
}: CompactProductCardProps) {
	const imageSource = typeof image === 'string' ? { uri: image } : image;

	const { showToast } = useToast();
	const dispatch = useDispatch();

	const cartItems = useSelector((state: RootState) => state.cart.cartItems);
	const cartItem = cartItems?.find((item: any) => item.id === id || item._id === id);
	const quantity = cartItem?.qty || 0;

	const handleIncrement = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		if (quantity > 0) {
			dispatch(
				updateCartItemQuantity({
					id,
					qty: quantity + 1,
				}),
			);
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
								: product?.sellPrice || price,
						image,
						vat: 0,
					},
					qty: 1,
				}),
			);
			showToast(`${product?.name || name} added to cart`);
		}
	};

	const handleDecrement = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

		if (quantity > 1) {
			dispatch(
				updateCartItemQuantity({
					id,
					qty: quantity - 1,
				}),
			);
		} else {
			dispatch(removeFromCart(id));
			showToast(`${product?.name || name} removed from cart`);
		}
	};

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={onPress}
			activeOpacity={0.7}>
			<View style={styles.imageContainer}>
				<Image
					source={imageSource || fallback}
					style={styles.image}
					resizeMode='cover'
				/>

				{/* Expanding Button Container */}
				<View style={[styles.buttonContainer, quantity > 0 && styles.buttonContainerExpanded]}>
					{quantity > 0 && (
						<>
							<TouchableOpacity
								onPress={handleDecrement}
								style={styles.iconButton}
								hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
								<IconSymbol
									name='minus'
									size={14}
									color={CustomColors.darkBrown}
								/>
							</TouchableOpacity>

							<Text style={styles.quantityText}>{quantity}</Text>
						</>
					)}

					<TouchableOpacity
						onPress={handleIncrement}
						style={styles.iconButton}
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
						<IconSymbol
							name='plus'
							size={16}
							color={CustomColors.darkBrown}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{badge && (
				<View style={styles.badgeContainer}>
					{badgeIcon && (
						<IconSymbol
							name={badgeIcon as any}
							size={10}
							color='#E63946'
						/>
					)}
					<Text style={styles.badgeText}>{badge}</Text>
				</View>
			)}
			<View style={styles.info}>
				<Text
					style={styles.name}
					numberOfLines={2}>
					{product?.name || name}
				</Text>
				{product?.unitValue && (
					<Text style={styles.unitPrice}>
						{`${product?.weight || product?.unitValue || weight} ${product?.unit || unit || 'unit'}`}
					</Text>
				)}
				<Text style={styles.price}>
					Tk{' '}
					{(
						product?.discountedPrice ||
						product?.sellPrice ||
						product?.price ||
						price
					).toLocaleString()}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		width: 140,
		backgroundColor: '#FFF',
		borderRadius: 10,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 3,
		elevation: 2,
	},
	imageContainer: {
		width: '100%',
		aspectRatio: 1,

		position: 'relative',
		borderRadius: 12,
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 12,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 6,
		right: 6,
		height: 28,
		minWidth: 28,
		borderRadius: 999,
		backgroundColor: '#FFF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.15,
		shadowRadius: 2,
		elevation: 2,
		paddingHorizontal: 0,
	},
	buttonContainerExpanded: {
		paddingHorizontal: 4,
		minWidth: 75,
		justifyContent: 'space-between',
	},
	iconButton: {
		width: 28,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
	},
	quantityText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#333',
		marginHorizontal: 2,
		minWidth: 14,
		textAlign: 'center',
	},
	badgeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingTop: 6,
		gap: 3,
	},
	badgeText: {
		fontSize: 10,
		color: '#E63946',
		fontWeight: '500',
	},
	info: {
		padding: 8,
		gap: 3,
	},
	name: {
		fontSize: 13,
		fontWeight: '400',
		color: '#333',
		lineHeight: 16,
		minHeight: 32,
	},
	price: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000',
		marginTop: 2,
	},
	unitPrice: {
		fontSize: 10,
		color: '#666',
		marginTop: 1,
	},
});
