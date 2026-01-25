import { CustomColors } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { addToCart, removeFromCart, updateCartItemQuantity } from '@/store/slices/cartSlice';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IconSymbol } from './ui/icon-symbol';

const fallback = require('../assets/images/splash-icon.png');

interface HorizontalProductCardProps {
	product: any;
	id: string;
	name: string;
	price: number;
	unit?: string;
	unitPrice?: number;
	badge?: string;
	badgeIcon?: string;
	image?: string;
	onPress: () => void;
}

export function HorizontalProductCard({
	product,
	id,
	name,
	price,
	unit,
	unitPrice,
	badge,
	badgeIcon,
	image,
	onPress,
}: HorizontalProductCardProps) {
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const cartItems = useSelector((state: any) => state.cart.cartItems);
	const cartItem = cartItems?.find((item: any) => item.id === id || item._id === id);
	const quantity = cartItem?.qty || 0;

	const handleAdd = () => {
		dispatch(
			addToCart({
				item: {
					id: product.id,
					_id: product.id,
					name: product.name,
					price: product.price,
					image: product.image || null,
					vat: 0,
				},
				qty: 1,
			}),
		);
		showToast(`${name} added to cart`);
	};

	const handleIncrement = () => {
		dispatch(
			updateCartItemQuantity({
				id: product.id,
				qty: quantity + 1,
			}),
		);
	};

	const handleDecrement = () => {
		if (quantity > 1) {
			dispatch(
				updateCartItemQuantity({
					id: product.id,
					qty: quantity - 1,
				}),
			);
		} else {
			dispatch(removeFromCart(product.id));
			showToast(`${name} removed from cart`);
		}
	};

	return (
		<TouchableOpacity
			style={styles.card}
			onPress={onPress}
			activeOpacity={0.7}>
			{/* Product Image */}
			<Image
				source={image ? { uri: image } : fallback}
				style={styles.image}
				resizeMode='cover'
			/>

			{/* Product Info */}
			<View style={styles.infoContainer}>
				<View style={styles.textContainer}>
					<Text
						style={styles.name}
						numberOfLines={2}>
						{name}
					</Text>
					{unit && unitPrice && (
						<Text style={styles.unit}>{unitPrice && `${unitPrice} • ${unit}`}</Text>
					)}
				</View>
				<View style={styles.bottomRow}>
					<Text style={styles.price}>Tk {price?.toLocaleString()}</Text>

					{quantity > 0 ? (
						<View style={styles.quantityControls}>
							<TouchableOpacity
								style={styles.quantityButton}
								onPress={e => {
									e.stopPropagation();
									handleDecrement();
								}}
								activeOpacity={0.7}>
								<IconSymbol
									name='minus'
									size={16}
									color='#FFF'
								/>
							</TouchableOpacity>
							<Text style={styles.quantityDisplayText}>{quantity}</Text>
							<TouchableOpacity
								style={styles.quantityButton}
								onPress={e => {
									e.stopPropagation();
									handleIncrement();
								}}
								activeOpacity={0.7}>
								<IconSymbol
									name='plus'
									size={16}
									color='#FFF'
								/>
							</TouchableOpacity>
						</View>
					) : (
						<TouchableOpacity
							style={styles.addButton}
							onPress={e => {
								e.stopPropagation();
								handleAdd();
							}}
							activeOpacity={0.7}>
							<IconSymbol
								name='plus'
								size={20}
								color='#FFF'
							/>
						</TouchableOpacity>
					)}
				</View>
			</View>

			{/* Badge */}
			{badge && (
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{badge}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		backgroundColor: '#FFF',
		marginBottom: 12,

		borderColor: '#F0F0F0',
	},
	image: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: '#F5F5F5',
	},
	infoContainer: {
		flex: 1,
		marginLeft: 12,
		justifyContent: 'space-between',
	},
	textContainer: {
		flex: 1,
	},
	name: {
		fontSize: 14,
		fontWeight: '400',
		color: '#111',
		marginBottom: 2,
	},
	unit: {
		fontSize: 12,
		color: '#666',
		marginBottom: 0,
	},
	bottomRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	price: {
		fontSize: 16,
		fontWeight: '500',
		color: '#000',
	},
	addButton: {
		width: 30,
		height: 30,
		borderRadius: 99,
		backgroundColor: CustomColors.darkBrown,
		justifyContent: 'center',
		alignItems: 'center',
	},
	quantityControls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: CustomColors.darkBrown,
		borderRadius: 18,
		paddingHorizontal: 6,
		paddingVertical: 4,
	},
	quantityButton: {
		width: 22,
		height: 22,
		borderRadius: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	quantityDisplayText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFF',
		minWidth: 20,
		textAlign: 'center',
	},
	badge: {
		position: 'absolute',
		top: 8,
		left: 8,
		backgroundColor: CustomColors.buttonBgColor,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	badgeText: {
		fontSize: 10,
		fontWeight: '600',
		color: '#FFF',
	},
});
