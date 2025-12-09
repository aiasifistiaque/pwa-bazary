import { IconSymbol } from '@/components/ui/icon-symbol';
import type { RootState } from '@/store';
import { Address, selectCheckoutAddress } from '@/store/slices/addressSlice';
import { resetCart } from '@/store/slices/cartSlice';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Alert,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateOrderMutation } from '@/store/services/checkoutApi';
import { useGetAllQuery } from '@/store/services/commonApi';
import { useGetSelfQuery } from '@/store/services/authApi';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeliveryTimeSlot = {
	id: string;
	day: string;
	time: string;
};

type IconName = React.ComponentProps<typeof IconSymbol>['name'];

type PaymentMethod = {
	id: string;
	name: string;
	icon: IconName | 'bkash' | 'nagad' | 'card' | 'cod';
	type: 'image' | 'icon';
};

const deliverySlots: DeliveryTimeSlot[] = [
	{ id: '1', day: 'Today', time: '6:00 PM - 9:00 PM' },
	{ id: '2', day: 'Tomorrow', time: '9:00 AM - 12:00 PM' },
	{ id: '3', day: 'Tomorrow', time: '12:00 PM - 3:00 PM' },
	{ id: '4', day: 'Tomorrow', time: '6:00 PM - 9:00 PM' },
];

const paymentMethods: PaymentMethod[] = [
	{ id: 'bkash', name: 'bKash', icon: 'bkash', type: 'image' },
	{ id: 'nagad', name: 'Nagad', icon: 'nagad', type: 'image' },
	{ id: 'card', name: 'Credit/Debit Card', icon: 'card', type: 'image' },
	{
		id: 'cod',
		name: 'Cash on Delivery',
		icon: 'cod',
		type: 'image',
	},
];

export default function CheckoutScreen() {
	const dispatch = useDispatch();
	const [createOrder, { isLoading }] = useCreateOrderMutation();
	const [errorMsg, setErrorMsg] = useState<string>('');
	const { total, subTotal, shipping, vat, discount, cartItems } = useSelector(
		(state: RootState) => state.cart
	);

	const selectedCheckoutAddr = useSelector(
		(state: RootState) => state.address.selectedCheckoutAddress
	);

	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
	const [selectedPayment, setSelectedPayment] = useState<string>('');
	const [couponCode, setCouponCode] = useState<string>('');
	const [showSavedAddresses, setShowSavedAddresses] = useState<boolean>(false);

	// Coupon state
	const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
	const [couponDiscount, setCouponDiscount] = useState<number>(0);
	const [couponMessage, setCouponMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);
	const userId = useSelector((state: RootState) => state.auth.user?._id);

	// Fetch user data and addresses
	const { data: userData } = useGetSelfQuery({});
	const customerId = userData?._id || userId;

	const { data: addressesData } = useGetAllQuery({
		path: 'addresses',
		filters: { customer: customerId },
	});
	const savedAddresses = (addressesData?.doc as Address[]) || [];

	// Fetch coupons
	const { data: couponsData } = useGetAllQuery({
		path: '/coupons',
	});

	const [address, setAddress] = useState({
		name: '',
		phone: '',
		street: '',
		area: '',
		city: '',
		postalCode: '',
	});

	// Auto-populate if address was selected
	useEffect(() => {
		if (selectedCheckoutAddr) {
			setAddress({
				name: selectedCheckoutAddr.name,
				phone: selectedCheckoutAddr.phone,
				street: selectedCheckoutAddr.street,
				area: selectedCheckoutAddr.area,
				city: selectedCheckoutAddr.city,
				postalCode: selectedCheckoutAddr.postalCode,
			});
			setShowSavedAddresses(false);
		}
	}, [selectedCheckoutAddr]);
	// optional: clear error when user changes key selections
	useEffect(() => {
		if (errorMsg) setErrorMsg('');
		// DON'T add deps that would cause unwanted clears; keep minimal
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTimeSlot, selectedPayment, address]);

	const handleSelectSavedAddress = (addr: Address) => {
		dispatch(selectCheckoutAddress(addr));
	};

	const handleBack = () => {
		router.back();
	};

	const handleApplyCoupon = () => {
		// Clear previous messages
		setCouponMessage(null);

		if (!couponCode.trim()) {
			setCouponMessage({ type: 'error', text: 'Please enter a coupon code' });
			return;
		}

		const coupons = couponsData?.doc || [];

		// Find coupon by code (case-sensitive)
		const coupon = coupons.find((c: any) => c.code === couponCode.trim());

		if (!coupon) {
			setCouponMessage({ type: 'error', text: 'Invalid coupon code' });
			return;
		}

		// Validate coupon is active
		if (!coupon.isActive) {
			setCouponMessage({
				type: 'error',
				text: 'This coupon is no longer active',
			});
			return;
		}

		// Validate date range
		const now = new Date();
		const validFrom = new Date(coupon.validFrom);
		const validTill = new Date(coupon.validTill);

		if (now < validFrom) {
			setCouponMessage({ type: 'error', text: 'This coupon is not yet valid' });
			return;
		}

		if (now > validTill) {
			setCouponMessage({ type: 'error', text: 'This coupon has expired' });
			return;
		}

		// Validate minimum order value
		if (subTotal < coupon.minOrderValue) {
			setCouponMessage({
				type: 'error',
				text: `Minimum order value of ৳${coupon.minOrderValue} required`,
			});
			return;
		}

		// Calculate discount
		let discountAmount = 0;
		if (coupon.isFlat) {
			// Flat discount
			discountAmount = coupon.maxAmount;
		} else {
			// Percentage discount
			discountAmount = (subTotal * coupon.percentage) / 100;
			// Cap at maxAmount if specified
			if (coupon.maxAmount > 0 && discountAmount > coupon.maxAmount) {
				discountAmount = coupon.maxAmount;
			}
		}

		// Apply coupon
		setAppliedCoupon(coupon);
		setCouponDiscount(discountAmount);
		setCouponMessage({
			type: 'success',
			text: `Coupon applied! You saved ৳${discountAmount}`,
		});
	};

	const handleRemoveCoupon = () => {
		setAppliedCoupon(null);
		setCouponDiscount(0);
		setCouponCode('');
		setCouponMessage(null);
	};
	const setError = (msg: string) => {
		setErrorMsg(msg);
		console.warn('Checkout validation error:', msg);
	};

	const handlePlaceOrder = async () => {
		// clear previous error first
		setErrorMsg('');
		if (!selectedTimeSlot) {
			setError('Please select a delivery time slot.');
			return;
		}
		if (
			!address.name ||
			!address.phone ||
			!address.street ||
			!address.area ||
			!address.city
		) {
			setError(
				'Please complete your delivery address (name, phone, street, area, city).'
			);
			return;
		}
		if (!selectedPayment) {
			setError('Please select a payment method.');
			return;
		}

		try {
			// Calculate final total with coupon discount
			const finalTotal = total - couponDiscount;
			const finalDiscount = discount + couponDiscount;

			const payload = {
				cart: {
					items: cartItems.map((item: any) => ({
						_id: item._id || item.id,
						name: item.name,
						qty: item.qty,
						unitPrice: item.unitPrice,
						totalPrice: item.price,
						image: item.image,
						uniqueId: item.uniqueId,
						unitVat: item.vat,
						...(item.note && { note: item.note }),
						...(item.variantName && { variantName: item.variantName }),
					})),
					total: finalTotal,
					subTotal,
					vat,
					shipping,
					discount: finalDiscount,
					couponId: appliedCoupon?._id || null,
					dueAmount: finalTotal,
				},
				address,
				paymentMethod: selectedPayment,
				paymentAmount: finalTotal,
				status: 'pending',
				origin: 'app',
				orderDate: new Date(),
			};

			const res = await createOrder({
				storeId: 'default',
				body: payload,
			}).unwrap();

			if (res) {
				dispatch(resetCart());
				Alert.alert(
					'Success',
					'Your order has been placed successfully!',
					[
						{
							text: 'OK',
							onPress: () => {
								// Use replace to prevent going back to checkout
								router.replace('/(protected)/orders');
							},
						},
					],
					{ cancelable: false } // Prevent dismissing alert without pressing OK
				);
			}
		} catch (error: any) {
			console.error(error);
			setError(
				error?.data?.message || 'Failed to place order. Please try again.'
			);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={handleBack} style={styles.backButton}>
					<IconSymbol name='chevron.left' size={24} color='#000000' />
				</Pressable>
				<Text style={styles.headerTitle}>Checkout</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Delivery Time Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol name='clock.fill' size={24} color='#E63946' />
						<Text style={styles.sectionTitle}>Choose Delivery Time</Text>
					</View>
					{deliverySlots.map(slot => (
						<Pressable
							key={slot.id}
							style={[
								styles.optionCard,
								selectedTimeSlot === slot.id && styles.selectedOption,
							]}
							onPress={() => setSelectedTimeSlot(slot.id)}
						>
							<View style={styles.radioCircle}>
								{selectedTimeSlot === slot.id && (
									<View style={styles.radioSelected} />
								)}
							</View>
							<View style={styles.optionInfo}>
								<Text style={styles.optionTitle}>{slot.day}</Text>
								<Text style={styles.optionSubtitle}>{slot.time}</Text>
							</View>
						</Pressable>
					))}
				</View>

				{/* Delivery Address Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol name='location.fill' size={24} color='#E63946' />
						<Text style={styles.sectionTitle}>Delivery Address</Text>
					</View>

					{/* Saved Addresses Button */}
					{savedAddresses.length > 0 && (
						<Pressable
							style={styles.savedAddressesButton}
							onPress={() => setShowSavedAddresses(!showSavedAddresses)}
						>
							<IconSymbol name='mappin.circle.fill' size={20} color='#E63946' />
							<Text style={styles.savedAddressesButtonText}>
								{showSavedAddresses
									? 'Hide Saved Addresses'
									: 'Choose from Saved Addresses'}
							</Text>
							<IconSymbol
								name={showSavedAddresses ? 'chevron.up' : 'chevron.down'}
								size={16}
								color='#666666'
							/>
						</Pressable>
					)}

					{/* Saved Addresses List */}
					{showSavedAddresses && (
						<View style={styles.savedAddressesList}>
							{savedAddresses.map(addr => {
								const addrId = (addr as any)._id || addr.id;
								const selectedId =
									(selectedCheckoutAddr as any)?._id ||
									selectedCheckoutAddr?.id;
								const isSelected = selectedId === addrId;

								return (
									<Pressable
										key={addrId}
										style={[
											styles.savedAddressCard,
											isSelected && styles.selectedSavedAddress,
										]}
										onPress={() => handleSelectSavedAddress(addr)}
									>
										<View style={styles.savedAddressHeader}>
											<View style={styles.addressLabelRow}>
												<IconSymbol
													name={
														addr.label === 'Home'
															? 'house.fill'
															: 'building.2.fill'
													}
													size={18}
													color='#E63946'
												/>
												<Text style={styles.savedAddressLabel}>
													{addr.label}
												</Text>
												{addr.isDefault && (
													<View style={styles.miniDefaultBadge}>
														<Text style={styles.miniDefaultText}>Default</Text>
													</View>
												)}
											</View>
											{isSelected && (
												<IconSymbol
													name='checkmark.circle.fill'
													size={24}
													color='#10B981'
												/>
											)}
										</View>
										<Text style={styles.savedAddressName}>{addr.name}</Text>
										<Text style={styles.savedAddressText}>{addr.phone}</Text>
										<Text style={styles.savedAddressText}>
											{addr.street}, {addr.area}, {addr.city} -{' '}
											{addr.postalCode}
										</Text>
									</Pressable>
								);
							})}
						</View>
					)}

					{/* Manual Address Form */}
					<View style={styles.formGroup}>
						<Text style={styles.label}>Full Name</Text>
						<TextInput
							style={styles.input}
							placeholder='Enter your full name'
							value={address.name}
							onChangeText={text => setAddress({ ...address, name: text })}
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Phone Number</Text>
						<TextInput
							style={styles.input}
							placeholder='01XXXXXXXXX'
							value={address.phone}
							onChangeText={text => setAddress({ ...address, phone: text })}
							keyboardType='phone-pad'
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Street Address</Text>
						<TextInput
							style={styles.input}
							placeholder='House no, Street name'
							value={address.street}
							onChangeText={text => setAddress({ ...address, street: text })}
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Area</Text>
						<TextInput
							style={styles.input}
							placeholder='Area/Locality'
							value={address.area}
							onChangeText={text => setAddress({ ...address, area: text })}
						/>
					</View>
					<View style={styles.formRow}>
						<View style={[styles.formGroup, { flex: 1 }]}>
							<Text style={styles.label}>City</Text>
							<TextInput
								style={styles.input}
								placeholder='City'
								value={address.city}
								onChangeText={text => setAddress({ ...address, city: text })}
							/>
						</View>
						<View style={[styles.formGroup, { flex: 1 }]}>
							<Text style={styles.label}>Postal Code</Text>
							<TextInput
								style={styles.input}
								placeholder='1200'
								value={address.postalCode}
								onChangeText={text =>
									setAddress({ ...address, postalCode: text })
								}
								keyboardType='number-pad'
							/>
						</View>
					</View>
				</View>

				{/* Payment Method Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol name='creditcard.fill' size={24} color='#E63946' />
						<Text style={styles.sectionTitle}>Payment Method</Text>
					</View>
					{paymentMethods.map(method => (
						<Pressable
							key={method.id}
							style={[
								styles.optionCard,
								selectedPayment === method.id && styles.selectedOption,
							]}
							onPress={() => setSelectedPayment(method.id)}
						>
							<View style={styles.radioCircle}>
								{selectedPayment === method.id && (
									<View style={styles.radioSelected} />
								)}
							</View>
							{method.type === 'image' ? (
								<Image
									source={
										method.id === 'bkash'
											? require('@/assets/images/bkash-logo.png')
											: method.id === 'nagad'
											? require('@/assets/images/nagad-logo.png')
											: method.id === 'cod'
											? require('@/assets/images/cod-logo.png')
											: require('@/assets/images/card-logo.png')
									}
									style={styles.paymentLogo}
								/>
							) : (
								<IconSymbol
									name={method.icon as IconName}
									size={24}
									color='#666666'
								/>
							)}
							<Text style={styles.paymentMethodName}>{method.name}</Text>
						</Pressable>
					))}
				</View>

				{/* Coupon Code Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol name='tag.fill' size={24} color='#E63946' />
						<Text style={styles.sectionTitle}>Coupon Code</Text>
					</View>
					<View style={styles.couponContainer}>
						<TextInput
							style={styles.couponInput}
							placeholder='Enter coupon code'
							value={couponCode}
							onChangeText={setCouponCode}
							editable={!appliedCoupon}
						/>
						{!appliedCoupon ? (
							<Pressable
								style={styles.applyCouponButton}
								onPress={handleApplyCoupon}
							>
								<Text style={styles.applyCouponText}>Apply</Text>
							</Pressable>
						) : (
							<Pressable
								style={styles.removeCouponButton}
								onPress={handleRemoveCoupon}
							>
								<Text style={styles.removeCouponText}>Remove</Text>
							</Pressable>
						)}
					</View>

					{/* Coupon Message */}
					{couponMessage && (
						<View
							style={[
								styles.couponMessageContainer,
								couponMessage.type === 'success'
									? styles.couponMessageSuccess
									: styles.couponMessageError,
							]}
						>
							<IconSymbol
								name={
									couponMessage.type === 'success'
										? 'checkmark.circle.fill'
										: 'exclamationmark.triangle.fill'
								}
								size={16}
								color={couponMessage.type === 'success' ? '#10B981' : '#DC2626'}
							/>
							<Text
								style={[
									styles.couponMessageText,
									couponMessage.type === 'success'
										? styles.couponMessageTextSuccess
										: styles.couponMessageTextError,
								]}
							>
								{couponMessage.text}
							</Text>
						</View>
					)}

					{/* Applied Coupon Display */}
					{appliedCoupon && (
						<View style={styles.appliedCouponBadge}>
							<IconSymbol name='tag.fill' size={16} color='#10B981' />
							<Text style={styles.appliedCouponText}>
								{appliedCoupon.code} - {appliedCoupon.description}
							</Text>
						</View>
					)}
				</View>

				{/* Order Summary */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Order Summary</Text>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Subtotal</Text>
						<Text style={styles.summaryValue}>
							৳{subTotal.toLocaleString()}
						</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Delivery Fee</Text>
						<Text style={styles.summaryValue}>
							৳{shipping.toLocaleString()}
						</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>VAT</Text>
						<Text style={styles.summaryValue}>৳{vat.toLocaleString()}</Text>
					</View>
					{discount > 0 && (
						<View style={styles.summaryRow}>
							<Text style={[styles.summaryLabel, { color: '#28A745' }]}>
								Discount
							</Text>
							<Text style={[styles.summaryValue, { color: '#28A745' }]}>
								-৳{discount.toLocaleString()}
							</Text>
						</View>
					)}
					{couponDiscount > 0 && (
						<View style={styles.summaryRow}>
							<Text style={[styles.summaryLabel, { color: '#10B981' }]}>
								Coupon Discount ({appliedCoupon?.code})
							</Text>
							<Text style={[styles.summaryValue, { color: '#10B981' }]}>
								-৳{couponDiscount.toLocaleString()}
							</Text>
						</View>
					)}
					<View style={[styles.summaryRow, styles.totalRow]}>
						<Text style={styles.totalLabel}>Total</Text>
						<Text style={styles.totalValue}>
							৳{(total - couponDiscount).toLocaleString()}
						</Text>
					</View>
				</View>

				{/* Bottom spacer */}
				{/* <View style={{ height: 100 }} /> */}
			</ScrollView>
			{/* Inline Error Banner */}
			{errorMsg ? (
				<View style={styles.errorBanner}>
					<IconSymbol
						name='exclamationmark.triangle.fill'
						size={18}
						color='#B91C1C'
					/>
					<Text style={styles.errorText}>{errorMsg}</Text>
				</View>
			) : null}
			{/* Place Order Button */}
			<View style={styles.bottomContainer}>
				<Pressable style={styles.placeOrderButton} onPress={handlePlaceOrder}>
					<Text style={styles.placeOrderText}>Place Order</Text>
					<Text style={styles.placeOrderPrice}>
						৳{(total - couponDiscount).toLocaleString()}
					</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	scrollContent: {
		// paddingBottom: 20,
	},
	section: {
		backgroundColor: '#FFFFFF',
		// marginTop: 12,
		padding: 16,
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	optionCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		backgroundColor: '#FFFFFF',
		marginBottom: 12,
		gap: 12,
	},
	selectedOption: {
		borderColor: '#E63946',
		backgroundColor: '#FFF5F5',
	},
	radioCircle: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#E5E5E5',
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioSelected: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: '#E63946',
	},
	optionInfo: {
		flex: 1,
	},
	optionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 2,
	},
	optionSubtitle: {
		fontSize: 14,
		color: '#666666',
	},
	paymentMethodName: {
		fontSize: 16,
		color: '#000000',
		fontWeight: '500',
		flex: 1,
	},
	formGroup: {
		marginBottom: 16,
	},
	formRow: {
		flexDirection: 'row',
		gap: 12,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: '#000000',
		backgroundColor: '#FFFFFF',
	},
	errorBanner: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: '#FEF2F2',
		borderWidth: 1,
		borderColor: '#FCA5A5',
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginHorizontal: 16,
		marginBottom: 8,
		borderRadius: 8,
	},
	errorText: {
		flex: 1,
		color: '#B91C1C',
		fontSize: 14,
		fontWeight: '600',
	},
	couponContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	couponInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: '#000000',
		backgroundColor: '#FFFFFF',
	},
	applyCouponButton: {
		backgroundColor: '#E63946',
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	applyCouponText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8,
	},
	summaryLabel: {
		fontSize: 14,
		color: '#666666',
	},
	summaryValue: {
		fontSize: 14,
		color: '#000000',
		fontWeight: '500',
	},
	totalRow: {
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		marginTop: 8,
		paddingTop: 12,
	},
	totalLabel: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	totalValue: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#E63946',
	},
	bottomContainer: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 16,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	placeOrderButton: {
		backgroundColor: '#E63946',
		borderRadius: 8,
		paddingVertical: 16,
		paddingHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	placeOrderText: {
		fontSize: 18,
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
	placeOrderPrice: {
		fontSize: 18,
		color: '#FFFFFF',
		fontWeight: 'bold',
	},
	savedAddressesButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: '#FFF5F5',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E63946',
		marginBottom: 16,
	},
	savedAddressesButtonText: {
		flex: 1,
		fontSize: 14,
		fontWeight: '600',
		color: '#E63946',
	},
	savedAddressesList: {
		marginBottom: 16,
	},
	savedAddressCard: {
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		backgroundColor: '#F9F9F9',
		marginBottom: 12,
	},
	selectedSavedAddress: {
		borderColor: '#10B981',
		backgroundColor: '#F0FDF4',
	},
	savedAddressHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	addressLabelRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	savedAddressLabel: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#000000',
	},
	miniDefaultBadge: {
		backgroundColor: '#FEF2F2',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#E63946',
	},
	miniDefaultText: {
		fontSize: 10,
		fontWeight: '600',
		color: '#E63946',
	},
	savedAddressName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 4,
	},
	savedAddressText: {
		fontSize: 13,
		color: '#666666',
		lineHeight: 18,
	},
	paymentLogo: {
		width: 24,
		height: 24,
		resizeMode: 'contain',
	},
	removeCouponButton: {
		backgroundColor: '#DC2626',
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	removeCouponText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	couponMessageContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 12,
		borderRadius: 8,
		marginTop: 12,
	},
	couponMessageSuccess: {
		backgroundColor: '#ECFDF5',
		borderWidth: 1,
		borderColor: '#10B981',
	},
	couponMessageError: {
		backgroundColor: '#FEF2F2',
		borderWidth: 1,
		borderColor: '#DC2626',
	},
	couponMessageText: {
		flex: 1,
		fontSize: 14,
		fontWeight: '500',
	},
	couponMessageTextSuccess: {
		color: '#10B981',
	},
	couponMessageTextError: {
		color: '#DC2626',
	},
	appliedCouponBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 12,
		backgroundColor: '#ECFDF5',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#10B981',
		marginTop: 12,
	},
	appliedCouponText: {
		flex: 1,
		fontSize: 13,
		color: '#059669',
		fontWeight: '500',
	},
});
