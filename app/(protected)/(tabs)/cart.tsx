import PrimaryButton from '@/components/buttons/PrimaryButton';
import { ProductCard } from '@/components/product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import type { RootState } from '@/store';
import { useGetAllQuery } from '@/store/services/commonApi';
import {
	addToCart,
	deleteOneFromCart,
	deleteSingleItemFromCart,
} from '@/store/slices/cartSlice';
import { router } from 'expo-router';
import {
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const fallback = require('../../../assets/images/fallback-fruit.png');
export default function CartScreen() {
	const dispatch = useDispatch();
	const { cartItems, total, subTotal } = useSelector(
		(state: RootState) => state.cart,
	);

	const { data: latestProducts } = useGetAllQuery({
		path: '/products',
		limit: 5,
		sort: '-createdAt',
	}) as any;

	const handleProductPress = (id: string) => {
		router.push(`/product/${id}` as any);
	};

	const handleIncrement = (uniqueId: string) => {
		const item = cartItems.find((item: any) => item.uniqueId === uniqueId);
		if (item) {
			dispatch(
				addToCart({
					item: {
						id: item.id,
						_id: item._id,
						name: item.name,
						price: item.unitPrice,
						image: item.image,
						vat: item.vat,
						// selectedSize: item.selectedSize,
						// selectedColor: item.selectedColor,
						variationId: item.variationId,
						variantStock: item.variantStock,
					},
					qty: 1,
				}),
			);
		}
	};

	const handleDecrement = (uniqueId: string) => {
		dispatch(deleteOneFromCart(uniqueId));
	};

	const handleRemove = (uniqueId: string) => {
		dispatch(deleteSingleItemFromCart(uniqueId));
	};

	const handleCheckout = () => {
		router.push('/checkout');
	};

	const handleBack = () => {
		router.back();
	};

	return (
		<View style={styles.safeArea}>
			{/* Header with Progress */}
			<View style={styles.headerSafeArea}>
				<View style={styles.header}>
					<Pressable onPress={handleBack} style={styles.closeButton}>
						<IconSymbol name='xmark' size={24} color='#000000' />
					</Pressable>
					<View style={styles.headerTitleContainer}>
						<Text style={styles.headerTitle}>Cart</Text>
					</View>
				</View>

				{/* Progress Stepper */}
				<View style={styles.progressContainer}>
					<View style={styles.stepContainer}>
						<View style={[styles.stepCircle, styles.stepActive]}>
							<Text style={styles.stepNumberActive}>1</Text>
						</View>
						<Text style={styles.stepLabel}>Menu</Text>
					</View>
					<View style={styles.progressLine} />
					<View style={styles.stepContainer}>
						<View style={[styles.stepCircle, styles.stepActive]}>
							<Text style={styles.stepNumberActive}>2</Text>
						</View>
						<Text style={styles.stepLabel}>Cart</Text>
					</View>
					<View style={[styles.progressLine, styles.progressLineInactive]} />
					<View style={styles.stepContainer}>
						<View style={styles.stepCircle}>
							<Text style={styles.stepNumber}>3</Text>
						</View>
						<Text style={styles.stepLabel}>Checkout</Text>
					</View>
				</View>
			</View>

			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Delivery Time Section */}
				{/* <View style={styles.deliverySection}>
					<Image
						source={{ uri: 'https://via.placeholder.com/100x100' }}
						style={styles.deliveryImage}
					/>
					<View style={styles.deliveryInfo}>
						<Text style={styles.deliveryLabel}>Delivery time</Text>
						<Text style={styles.deliveryTime}>Standard (15-30 mins)</Text>
						<Pressable>
							<Text style={styles.changeText}>Change</Text>
						</Pressable>
					</View>
				</View> */}

				{/* Cart Items */}
				<View style={styles.itemsList}>
					{cartItems.length === 0 ? (
						<View style={styles.emptyCart}>
							<Text style={styles.emptyCartText}>Your cart is empty</Text>
						</View>
					) : (
						cartItems?.map((item: any) => (
							<View key={item.uniqueId} style={styles.cartItem}>
								{item.image ? (
									<Image
										source={{
											uri: item.image,
										}}
										style={styles.itemImage}
									/>
								) : (
									<Image source={fallback} style={styles.itemImage} />
								)}
								<View style={styles.itemInfo}>
									<Text style={styles.itemName} numberOfLines={2}>
										{item.name}
									</Text>
									{item.variantName && (
										<Text style={styles.itemVariant}>{item.variantName}</Text>
									)}
									<View style={styles.itemFooter}>
										<View style={styles.quantityControls}>
											{item.qty === 1 ? (
												<Pressable
													onPress={() => handleRemove(item.uniqueId)}
													style={styles.quantityButton}
												>
													<IconSymbol name='minus' size={18} color='#666666' />
												</Pressable>
											) : (
												<Pressable
													onPress={() => handleDecrement(item.uniqueId)}
													style={styles.quantityButton}
												>
													<IconSymbol name='minus' size={18} color='#000000' />
												</Pressable>
											)}
											<Text style={styles.quantityText}>{item.qty}</Text>
											<Pressable
												onPress={() => handleIncrement(item.uniqueId)}
												style={styles.quantityButton}
											>
												<IconSymbol name='plus' size={18} color='#000000' />
											</Pressable>
										</View>
										<Text style={styles.itemPrice}>
											Tk {item.price.toLocaleString()}
										</Text>
									</View>
								</View>
							</View>
						))
					)}
				</View>

				{/* Add More Items */}
				<Pressable
					style={styles.addMoreButton}
					onPress={() => router.push('/(protected)/(tabs)/search')}
				>
					<IconSymbol name='plus' size={20} color='#000000' />
					<Text style={styles.addMoreText}>{cartItems.length > 0 ? 'Add More Items' : 'Explore Products'}</Text>
				</Pressable>

				{/* Popular with your order */}
				<View style={styles.popularSection}>
					<Text style={styles.popularTitle}>What's new on Bazarey</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.popularScroll}
					>
						{latestProducts?.doc?.map((item: any) => (
							<View key={item.id} style={styles.popularCardContainer}>
								<ProductCard
									product={item}
									id={item.id}
									name={item.name}
									image={item.image}
									price={item.salePrice || item.price}
									unit={item.unit}
									unitPrice={item.price}
									onPress={() => handleProductPress(item.id)}
								/>
							</View>
						))}
					</ScrollView>
				</View>

				{/* Total Section */}
				{cartItems.length > 0 && (
					<View style={styles.totalSection}>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Total (incl. fees and tax)</Text>
							<View style={styles.totalPriceContainer}>
								<Text style={styles.totalPrice}>
									Tk {total.toLocaleString()}
								</Text>
								{subTotal !== total && (
									<Text style={styles.originalPrice}>
										Tk {subTotal.toLocaleString()}
									</Text>
								)}
							</View>
						</View>
						{/* <Pressable onPress={handleCheckout}>
							<Text style={styles.seeSummary}>See summary</Text>
						</Pressable> */}
						{subTotal < 300 && (
							<Text style={styles.seeSummary}>{`Add Tk ${300 - subTotal} more to proceed`}</Text>
						)}
					</View>
				)}

				{/* Bottom spacer */}
				<View style={{ height: 20 }} />
			</ScrollView>

			{/* Review Button */}
			{cartItems.length > 0 && (
				<View style={styles.checkoutContainer}>
					<PrimaryButton
						// icon='info.circle'
						title='Review payment and address'
						onPress={handleCheckout}
						disabled={subTotal < 300}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	headerSafeArea: {
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
		gap: 12,
	},
	closeButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitleContainer: {
		flex: 1,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 2,
	},
	headerSubtitle: {
		fontSize: 13,
		color: '#666666',
	},
	progressContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 16,
		justifyContent: 'space-between',
	},
	stepContainer: {
		alignItems: 'center',
		gap: 6,
	},
	stepCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#E5E5E5',
		alignItems: 'center',
		justifyContent: 'center',
	},
	stepActive: {
		backgroundColor: '#333333',
	},
	stepNumber: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#999999',
	},
	stepNumberActive: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFFFFF',
	},
	stepLabel: {
		fontSize: 12,
		color: '#666666',
		fontWeight: '500',
	},
	progressLine: {
		flex: 1,
		height: 2,
		backgroundColor: '#333333',
		marginHorizontal: 8,
		marginBottom: 20,
	},
	progressLineInactive: {
		backgroundColor: '#E5E5E5',
	},
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	scrollContent: {
		paddingBottom: 20,
	},
	deliverySection: {
		flexDirection: 'row',
		padding: 16,
		backgroundColor: '#F8F8F8',
		marginHorizontal: 16,
		marginTop: 16,
		borderRadius: 12,
		gap: 12,
	},
	deliveryImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
	},
	deliveryInfo: {
		flex: 1,
		justifyContent: 'center',
	},
	deliveryLabel: {
		fontSize: 13,
		color: '#666666',
		marginBottom: 4,
	},
	deliveryTime: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 6,
	},
	changeText: {
		fontSize: 14,
		color: '#E63946',
		fontWeight: '600',
	},
	itemsList: {
		paddingTop: 16,
	},
	emptyCart: {
		paddingVertical: 40,
		alignItems: 'center',
	},
	emptyCartText: {
		fontSize: 16,
		color: '#999999',
	},
	cartItem: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 16,
		gap: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	itemImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
	},
	itemInfo: {
		flex: 1,
		justifyContent: 'space-between',
	},
	itemName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
		lineHeight: 20,
	},
	itemVariant: {
		fontSize: 13,
		color: '#666666',
		marginTop: 2,
	},
	itemFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	quantityControls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
		backgroundColor: '#F8F8F8',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	quantityButton: {
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	quantityText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
		minWidth: 24,
		textAlign: 'center',
	},
	itemPrice: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
	},
	addMoreButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	addMoreText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
	},
	popularSection: {
		paddingTop: 24,
		paddingBottom: 16,
	},
	popularTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000000',
		paddingHorizontal: 16,
		marginBottom: 12,
	},
	popularSubtitle: {
		fontSize: 14,
		color: '#666666',
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	popularScroll: {
		paddingLeft: 16,
		gap: 12,
	},
	popularCardContainer: {
		marginRight: 4,
		marginBottom: 4,
	},
	totalSection: {
		paddingHorizontal: 16,
		paddingVertical: 20,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		gap: 8,
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	totalLabel: {
		fontSize: 14,
		color: '#000000',
		fontWeight: '500',
	},
	totalPriceContainer: {
		alignItems: 'flex-end',
	},
	totalPrice: {
		fontSize: 20,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
	},
	originalPrice: {
		fontSize: 13,
		color: '#999999',
		textDecorationLine: 'line-through',
		marginTop: 2,
	},
	seeSummary: {
		fontSize: 14,
		color: CustomColors.lightRed,
		// textDecorationLine: 'underline',
		fontWeight: '500',
	},
	checkoutContainer: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	checkoutButton: {
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 10,
		paddingVertical: 16,
		alignItems: 'center',
	},
	checkoutButtonText: {
		fontSize: 17,
		color: CustomColors.darkBrown,
		fontWeight: 'bold',
	},
});
