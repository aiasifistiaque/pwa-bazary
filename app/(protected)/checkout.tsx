import PrimaryButton from '@/components/buttons/PrimaryButton';
import CustomHeader from '@/components/header/CustomHeader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomColors } from '@/constants/theme';
import type { RootState } from '@/store';
import { useGetSelfQuery } from '@/store/services/authApi';
import { useCreateOrderMutation } from '@/store/services/checkoutApi';
import { useGetAllQuery, usePostMutation } from '@/store/services/commonApi';
import { Address, selectCheckoutAddress } from '@/store/slices/addressSlice';
import { resetCart } from '@/store/slices/cartSlice';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

type DeliveryTimeSlot = {
	id: string;
	day: string;
	time: string;
	date?: Date;
	startTime?: Date;
	endTime?: Date;
};

type IconName = React.ComponentProps<typeof IconSymbol>['name'];

type PaymentMethod = {
	id: string;
	name: string;
	icon: IconName | 'online' | 'cod';
	type: 'image' | 'icon';
};

const paymentMethods: PaymentMethod[] = [
	{ id: 'online', name: 'Pay Online', icon: 'online', type: 'image' },
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
	const [verifyCoupon, { isLoading: verifyingCoupon }] = usePostMutation();
	const [errorMsg, setErrorMsg] = useState<string>('');
	const { total, subTotal, shipping, vat, discount, cartItems } = useSelector(
		(state: RootState) => state.cart,
	);

	const selectedCheckoutAddr = useSelector(
		(state: RootState) => state.address.selectedCheckoutAddress,
	);

	const [selectedTimeSlot, setSelectedTimeSlot] = useState<DeliveryTimeSlot | null>(null);
	const [selectedPayment, setSelectedPayment] = useState<string>('');
	const [couponCode, setCouponCode] = useState<string>('');
	const [showSavedAddresses, setShowSavedAddresses] = useState<boolean>(false);
	const [usePoints, setUsePoints] = useState<boolean>(false);
	const [showCityDropdown, setShowCityDropdown] = useState(false);
	const [showAreaDropdown, setShowAreaDropdown] = useState(false);

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

	// Fetch areas
	const { data: areasData } = useGetAllQuery({
		path: 'areas',
		filters: { isActive: true },
	});

	// Fetch available delivery slots
	const { data: slotsData, isLoading: slotsLoading } = useGetAllQuery({
		path: '/get/slots/available',
		invalidatesTags: ['Slots'],
	});

	const [address, setAddress] = useState({
		label: '',
		name: '',
		phone: '',
		street: '',
		appartment: '',
		area: '',
		city: '',
		postalCode: '',
		instructions: '',
	});

	// Auto-populate if address was selected
	useEffect(() => {
		if (selectedCheckoutAddr) {
			setAddress({
				label: selectedCheckoutAddr.label || '',
				name: selectedCheckoutAddr.name,
				phone: selectedCheckoutAddr.phone,
				street: selectedCheckoutAddr.street,
				appartment: selectedCheckoutAddr.appartment || '',
				area: selectedCheckoutAddr.area,
				city: selectedCheckoutAddr.city,
				postalCode: selectedCheckoutAddr.postalCode,
				instructions: selectedCheckoutAddr.instructions || '',
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

	// Format slots from API
	const deliverySlots: DeliveryTimeSlot[] = (slotsData?.doc || []).map((slot: any) => {
		const slotDate = new Date(slot.date);

		// Helper function to convert 24-hour time string to 12-hour AM/PM format
		const formatTime = (timeString: string): string => {
			const [hours, minutes] = timeString.split(':').map(Number);
			const period = hours >= 12 ? 'PM' : 'AM';
			const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
			return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
		};

		// Format date as "Tomorrow", "Day after tomorrow", or actual date
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const dayAfterTomorrow = new Date(today);
		dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

		let dayLabel = '';
		if (slotDate.toDateString() === tomorrow.toDateString()) {
			dayLabel = 'Tomorrow';
		} else if (slotDate.toDateString() === dayAfterTomorrow.toDateString()) {
			dayLabel = 'Day After Tomorrow';
		} else {
			dayLabel = slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		}

		// Format time range from 24-hour strings to 12-hour AM/PM
		const timeRange = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;

		return {
			id: slot._id,
			day: dayLabel,
			time: timeRange,
			date: slotDate,
			startTime: slot.startTime,
			endTime: slot.endTime,
		};
	});

	const handleSelectSavedAddress = (addr: Address) => {
		dispatch(selectCheckoutAddress(addr));
	};

	const handleBack = () => {
		router.back();
	};

	const handleApplyCoupon = async () => {
		// Clear previous messages
		setCouponMessage(null);

		if (!couponCode.trim()) {
			setCouponMessage({ type: 'error', text: 'Please enter a coupon code' });
			return;
		}

		try {
			const result = await verifyCoupon({
				path: '/get/coupons/verify',
				body: {
					code: couponCode.trim(),
					orderValue: subTotal,
					customerId: customerId,
				},
			}).unwrap();

			if (!result.success) {
				setCouponMessage({
					type: 'error',
					text: result.message || 'Failed to verify coupon',
				});
				return;
			}

			// Apply coupon from verified response
			setAppliedCoupon(result.data);
			setCouponDiscount(result.data.discountAmount);
			setCouponMessage({
				type: 'success',
				text: `Coupon applied! You saved ৳${result.data.discountAmount.toFixed(0)}`,
			});
		} catch (error: any) {
			console.error('Coupon verification error:', error);
			setCouponMessage({
				type: 'error',
				text: error?.data?.message || 'Failed to verify coupon. Please try again.',
			});
		}
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
		if (!selectedTimeSlot || !selectedTimeSlot.id) {
			setError('Please select a delivery time slot.');
			return;
		}
		if (!address.name || !address.phone || !address.street || !address.area || !address.city) {
			setError('Please complete your delivery address (name, phone, street, area, city).');
			return;
		}
		if (!selectedPayment) {
			setError('Please select a payment method.');
			return;
		}

		try {
			// Calculate points discount
			const availablePoints = userData?.points || 0;
			const pointsDiscount = usePoints ? Math.min(availablePoints, total - couponDiscount) : 0;

			// Calculate final total with coupon and points discount
			const finalTotal = total - couponDiscount - pointsDiscount;
			const finalDiscount = discount + couponDiscount + pointsDiscount;

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
					couponId: appliedCoupon?._id || undefined,
					dueAmount: finalTotal,
				},
				address,
				customer: customerId, // Add logged-in user ID
				paymentMethod: selectedPayment,
				paymentAmount: finalTotal,
				status: 'pending',
				paidAmount: finalTotal,
				couponCode: appliedCoupon?.code || undefined,
				discount: finalDiscount,
				origin: 'app',
				orderDate: new Date(),
				// Delivery slot data
				slot: `${selectedTimeSlot.day}, ${selectedTimeSlot.time}`,
				deliverySlot: selectedTimeSlot.id,
				// Points usage
				...(usePoints && pointsDiscount > 0 && { pointsUsed: pointsDiscount }),
			};

			const res = await createOrder({
				storeId: 'default',
				body: payload,
			}).unwrap();

			if (res) {
				dispatch(resetCart());

				// Check if paymentUrl is present (Moneybag integration)
				if (res.paymentUrl) {
					await WebBrowser.openBrowserAsync(res.paymentUrl);
					// Note: Redirect handling would typically happen via deep linking or user manually returning.
					// For now, we assume the user completes payment in the browser.
				}

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
					{ cancelable: false }, // Prevent dismissing alert without pressing OK
				);
			}
		} catch (error: any) {
			console.error(error);
			setError(error?.data?.message || 'Failed to place order. Please try again.');
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Header */}
			<CustomHeader>Checkout</CustomHeader>

			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.scrollContent}>
				{/* Delivery Time Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol
							name='clock.fill'
							size={24}
							color={CustomColors.darkBrown}
						/>
						<Text style={styles.sectionTitle}>Choose Delivery Time</Text>
					</View>
					{slotsLoading ? (
						<View style={styles.loadingContainer}>
							<Text style={styles.loadingText}>Loading available slots...</Text>
						</View>
					) : deliverySlots.length === 0 ? (
						<View style={styles.noSlotsContainer}>
							<Text style={styles.noSlotsText}>No delivery slots available at the moment</Text>
						</View>
					) : (
						deliverySlots.map(slot => (
							<Pressable
								key={slot.id}
								style={[
									styles.optionCard,
									selectedTimeSlot?.id === slot.id && styles.selectedOption,
								]}
								onPress={() => setSelectedTimeSlot(slot)}>
								<View style={styles.radioCircle}>
									{selectedTimeSlot?.id === slot.id && <View style={styles.radioSelected} />}
								</View>
								<View style={styles.optionInfo}>
									<Text style={styles.optionTitle}>{slot.day}</Text>
									<Text style={styles.optionSubtitle}>{slot.time}</Text>
								</View>
							</Pressable>
						))
					)}
				</View>

				{/* Delivery Address Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol
							name='location.fill'
							size={24}
							color={CustomColors.darkBrown}
						/>
						<Text style={styles.sectionTitle}>Delivery Address</Text>
					</View>

					{/* Saved Addresses Button */}
					{savedAddresses.length > 0 && (
						<Pressable
							style={styles.savedAddressesButton}
							onPress={() => setShowSavedAddresses(!showSavedAddresses)}>
							<IconSymbol
								name='mappin.circle.fill'
								size={20}
								color={CustomColors.darkBrown}
							/>
							<Text style={styles.savedAddressesButtonText}>
								{showSavedAddresses ? 'Hide Saved Addresses' : 'Choose from Saved Addresses'}
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
								const selectedId = (selectedCheckoutAddr as any)?._id || selectedCheckoutAddr?.id;
								const isSelected = selectedId === addrId;

								return (
									<Pressable
										key={addrId}
										style={[styles.savedAddressCard, isSelected && styles.selectedSavedAddress]}
										onPress={() => handleSelectSavedAddress(addr)}>
										<View style={styles.savedAddressHeader}>
											<View style={styles.addressLabelRow}>
												<IconSymbol
													name={addr.label === 'Home' ? 'house.fill' : 'building.2.fill'}
													size={18}
													color={CustomColors.darkBrown}
												/>
												<Text style={styles.savedAddressLabel}>{addr.label}</Text>
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
											{addr.street}, {addr.area}, {addr.city} - {addr.postalCode}
										</Text>
									</Pressable>
								);
							})}
						</View>
					)}

					{/* Manual Address Form */}
					<View style={styles.formField}>
						<Text style={styles.label}>Label</Text>
						<View style={styles.labelOptions}>
							{['Home', 'Office', 'Other'].map(label => (
								<Pressable
									key={label}
									style={[styles.labelOption, address.label === label && styles.labelOptionActive]}
									onPress={() => setAddress({ ...address, label })}>
									<Text
										style={[
											styles.labelOptionText,
											address.label === label && styles.labelOptionTextActive,
										]}>
										{label}
									</Text>
								</Pressable>
							))}
						</View>
					</View>

					<View style={styles.formGroup}>
						<Text style={styles.label}>Full Name *</Text>
						<TextInput
							style={styles.input}
							placeholder='Enter your full name'
							value={address.name}
							onChangeText={text => setAddress({ ...address, name: text })}
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Phone Number *</Text>
						<TextInput
							style={styles.input}
							placeholder='+880 1XXXXXXXXX'
							value={address.phone}
							onChangeText={text => setAddress({ ...address, phone: text })}
							keyboardType='phone-pad'
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Street Address *</Text>
						<TextInput
							style={styles.input}
							placeholder='House/Flat no., Street'
							value={address.street}
							onChangeText={text => setAddress({ ...address, street: text })}
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Apartment, Suite, etc. (Optional)</Text>
						<TextInput
							style={styles.input}
							placeholder='Apt, Suite, Floor, etc.'
							value={address.appartment}
							onChangeText={text => setAddress({ ...address, appartment: text })}
						/>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Area *</Text>
						<Pressable
							style={styles.dropdownButton}
							onPress={() => setShowAreaDropdown(!showAreaDropdown)}>
							<Text style={[styles.dropdownText, !address.area && styles.placeholderText]}>
								{address.area || 'Select area'}
							</Text>
							<IconSymbol
								name={showAreaDropdown ? 'chevron.up' : 'chevron.down'}
								size={16}
								color='#666666'
							/>
						</Pressable>
						{showAreaDropdown && (
							<View style={styles.dropdownMenu}>
								<ScrollView style={styles.dropdownScroll}>
									{areasData?.doc?.map((area: any, index: number) => (
										<Pressable
											key={index}
											style={styles.dropdownItem}
											onPress={() => {
												setAddress({ ...address, area: area.name });
												setShowAreaDropdown(false);
											}}>
											<Text style={styles.dropdownItemText}>{area.name}</Text>
											{address.area === area.name && (
												<IconSymbol
													name='checkmark'
													size={16}
													color={CustomColors.darkBrown}
												/>
											)}
										</Pressable>
									))}
								</ScrollView>
							</View>
						)}
					</View>
					<View style={styles.formRow}>
						<View style={[styles.formGroup, { flex: 1 }]}>
							<Text style={styles.label}>City *</Text>
							<Pressable
								style={styles.dropdownButton}
								onPress={() => setShowCityDropdown(!showCityDropdown)}>
								<Text style={[styles.dropdownText, !address.city && styles.placeholderText]}>
									{address.city || 'Select city'}
								</Text>
								<IconSymbol
									name={showCityDropdown ? 'chevron.up' : 'chevron.down'}
									size={16}
									color='#666666'
								/>
							</Pressable>
							{showCityDropdown && (
								<View style={styles.dropdownMenu}>
									<Pressable
										style={styles.dropdownItem}
										onPress={() => {
											setAddress({ ...address, city: 'Dhaka' });
											setShowCityDropdown(false);
										}}>
										<Text style={styles.dropdownItemText}>Dhaka</Text>
										{address.city === 'Dhaka' && (
											<IconSymbol
												name='checkmark'
												size={16}
												color={CustomColors.darkBrown}
											/>
										)}
									</Pressable>
								</View>
							)}
						</View>
						<View style={[styles.formGroup, { flex: 1 }]}>
							<Text style={styles.label}>Postal Code</Text>
							<TextInput
								style={styles.input}
								placeholder='1200'
								value={address.postalCode}
								onChangeText={text => setAddress({ ...address, postalCode: text })}
								keyboardType='number-pad'
							/>
						</View>
					</View>
					<View style={styles.formGroup}>
						<Text style={styles.label}>Delivery Instructions (Optional)</Text>
						<TextInput
							style={[styles.input, styles.textarea]}
							placeholder='E.g., Ring the bell, Call upon arrival, etc.'
							value={address.instructions}
							onChangeText={text => setAddress({ ...address, instructions: text })}
							multiline
							numberOfLines={3}
							textAlignVertical='top'
						/>
					</View>
				</View>

				{/* Payment Method Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol
							name='creditcard.fill'
							size={24}
							color={CustomColors.darkBrown}
						/>
						<Text style={styles.sectionTitle}>Payment Method</Text>
					</View>
					{paymentMethods.map(method => (
						<Pressable
							key={method.id}
							style={[styles.optionCard, selectedPayment === method.id && styles.selectedOption]}
							onPress={() => setSelectedPayment(method.id)}>
							<View style={styles.radioCircle}>
								{selectedPayment === method.id && <View style={styles.radioSelected} />}
							</View>
							{method.type === 'image' ? (
								<Image
									source={
										method.id === 'online'
											? require('@/assets/images/card-logo.png') // You can use a generic online payment logo here if available, or keep card-logo
											: require('@/assets/images/cod-logo.png')
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

				{/* Use Points Section */}
				{userData?.points > 0 && (
					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<IconSymbol
								name='star.fill'
								size={24}
								color={CustomColors.darkBrown}
							/>
							<Text style={styles.sectionTitle}>Use Loyalty Points</Text>
						</View>
						{appliedCoupon && (
							<View style={styles.disabledMessage}>
								<IconSymbol
									name='info.circle.fill'
									size={16}
									color='#666666'
								/>
								<Text style={styles.disabledMessageText}>Remove coupon to use loyalty points</Text>
							</View>
						)}
						<Pressable
							style={[
								styles.optionCard,
								usePoints && styles.selectedOption,
								appliedCoupon && styles.disabledOption,
							]}
							onPress={() => !appliedCoupon && setUsePoints(!usePoints)}
							disabled={!!appliedCoupon}>
							<View style={styles.radioCircle}>
								{usePoints && <View style={styles.radioSelected} />}
							</View>
							<View style={styles.optionInfo}>
								<Text style={[styles.optionTitle, appliedCoupon && styles.disabledText]}>
									Use {Math.min(userData.points, total - couponDiscount).toLocaleString()} Points
								</Text>
								<Text style={[styles.optionSubtitle, appliedCoupon && styles.disabledText]}>
									Available: {userData.points.toLocaleString()} points (1 point = ৳1)
								</Text>
							</View>
						</Pressable>
					</View>
				)}

				{/* Coupon Code Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<IconSymbol
							name='tag.fill'
							size={24}
							color={CustomColors.darkBrown}
						/>
						<Text style={styles.sectionTitle}>Coupon Code</Text>
					</View>
					{usePoints && (
						<View style={styles.disabledMessage}>
							<IconSymbol
								name='circle.fill'
								size={16}
								color='#666666'
							/>
							<Text style={styles.disabledMessageText}>Disable loyalty points to use coupon</Text>
						</View>
					)}
					<View style={styles.couponContainer}>
						<TextInput
							style={[styles.couponInput, usePoints && styles.disabledInput]}
							placeholder='Enter coupon code'
							value={couponCode}
							onChangeText={setCouponCode}
							editable={!appliedCoupon && !verifyingCoupon && !usePoints}
						/>
						{!appliedCoupon ? (
							<Pressable
								style={[
									styles.applyCouponButton,
									(verifyingCoupon || usePoints) && styles.applyCouponButtonDisabled,
								]}
								onPress={handleApplyCoupon}
								disabled={verifyingCoupon || usePoints}>
								<Text style={styles.applyCouponText}>
									{verifyingCoupon ? 'Verifying...' : 'Apply'}
								</Text>
							</Pressable>
						) : (
							<Pressable
								style={styles.removeCouponButton}
								onPress={handleRemoveCoupon}>
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
							]}>
							<IconSymbol
								name={
									couponMessage.type === 'success'
										? 'checkmark.circle.fill'
										: 'exclamationmark.triangle.fill'
								}
								size={16}
								color={couponMessage.type === 'success' ? '#10B981' : CustomColors.darkBrown}
							/>
							<Text
								style={[
									styles.couponMessageText,
									couponMessage.type === 'success'
										? styles.couponMessageTextSuccess
										: styles.couponMessageTextError,
								]}>
								{couponMessage.text}
							</Text>
						</View>
					)}

					{/* Applied Coupon Display */}
					{appliedCoupon && (
						<View style={styles.appliedCouponBadge}>
							<IconSymbol
								name='tag.fill'
								size={16}
								color='#10B981'
							/>
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
						<Text style={styles.summaryValue}>Tk {subTotal.toLocaleString()}</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Delivery Fee</Text>
						<Text style={styles.summaryValue}>Tk {shipping.toLocaleString()}</Text>
					</View>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>VAT</Text>
						<Text style={styles.summaryValue}>Tk {vat.toLocaleString()}</Text>
					</View>
					{discount > 0 && (
						<View style={styles.summaryRow}>
							<Text style={[styles.summaryLabel, { color: '#28A745' }]}>Discount</Text>
							<Text style={[styles.summaryValue, { color: '#28A745' }]}>
								-Tk {discount.toLocaleString()}
							</Text>
						</View>
					)}
					{couponDiscount > 0 && (
						<View style={styles.summaryRow}>
							<Text style={[styles.summaryLabel, { color: '#10B981' }]}>
								Coupon Discount ({appliedCoupon?.code})
							</Text>
							<Text style={[styles.summaryValue, { color: '#10B981' }]}>
								-Tk {couponDiscount.toLocaleString()}
							</Text>
						</View>
					)}
					{usePoints && userData?.points > 0 && (
						<View style={styles.summaryRow}>
							<Text style={[styles.summaryLabel, { color: '#F59E0B' }]}>Points Discount</Text>
							<Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
								-Tk {Math.min(userData.points, total - couponDiscount).toLocaleString()}
							</Text>
						</View>
					)}
					<View style={[styles.summaryRow, styles.totalRow]}>
						<Text style={styles.totalLabel}>Total</Text>
						<Text style={styles.totalValue}>
							Tk{' '}
							{(
								total -
								couponDiscount -
								(usePoints ? Math.min(userData?.points || 0, total - couponDiscount) : 0)
							).toLocaleString()}
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
						color={CustomColors.darkBrown}
					/>
					<Text style={styles.errorText}>{errorMsg}</Text>
				</View>
			) : null}
			{/* Place Order Button */}
			<View style={styles.bottomContainer}>
				<PrimaryButton
					title={`Place Order - ৳${(total - couponDiscount - (usePoints ? Math.min(userData?.points || 0, total - couponDiscount) : 0)).toLocaleString()}`}
					onPress={handlePlaceOrder}
					loading={isLoading}
					disabled={isLoading}
				/>
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
		fontWeight: '500',
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
		fontWeight: '500',
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
		// borderColor: CustomColors.darkBrown,
		backgroundColor: CustomColors.lightBrown,
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
		backgroundColor: CustomColors.darkBrown,
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
		fontWeight: '400',
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
		backgroundColor: CustomColors.lightBrown,
		borderWidth: 1,
		borderColor: CustomColors.darkBrown,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginHorizontal: 16,
		marginBottom: 8,
		borderRadius: 8,
	},
	errorText: {
		flex: 1,
		color: CustomColors.darkBrown,
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
		backgroundColor: CustomColors.lightBrown,
		paddingHorizontal: 24,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	applyCouponButtonDisabled: {
		opacity: 0.5,
	},
	applyCouponText: {
		fontSize: 16,
		fontWeight: '600',
		color: CustomColors.darkBrown,
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
		fontWeight: '500',
		color: '#000000',
	},
	totalValue: {
		fontSize: 20,
		fontWeight: '500',
		color: '#000',
	},
	bottomContainer: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 16,
		paddingTop: 10,
		paddingBottom: 0,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
	},
	placeOrderButton: {
		backgroundColor: CustomColors.darkBrown,
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
		fontWeight: '500',
	},
	placeOrderPrice: {
		fontSize: 18,
		color: '#FFFFFF',
		fontWeight: '500',
	},
	savedAddressesButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 8,
		// borderWidth: 1,
		// borderColor: CustomColors.darkBrown,
		marginBottom: 16,
	},
	savedAddressesButtonText: {
		flex: 1,
		fontSize: 14,
		fontWeight: '600',
		color: CustomColors.darkBrown,
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
		marginBottom: 8,
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
		fontWeight: '500',
		color: '#000000',
	},
	miniDefaultBadge: {
		backgroundColor: CustomColors.lightBrown,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
		// borderWidth: 1,
		// borderColor: CustomColors.darkBrown,
	},
	miniDefaultText: {
		fontSize: 10,
		fontWeight: '600',
		color: CustomColors.darkBrown,
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
		backgroundColor: CustomColors.lightRed,
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
		borderColor: CustomColors.lightGreen,
	},
	couponMessageError: {
		backgroundColor: CustomColors.lightBrown,
		borderWidth: 1,
		borderColor: CustomColors.darkBrown,
	},
	couponMessageText: {
		flex: 1,
		fontSize: 14,
		fontWeight: '500',
	},
	couponMessageTextSuccess: {
		color: CustomColors.lightGreen,
	},
	couponMessageTextError: {
		color: CustomColors.darkBrown,
	},
	appliedCouponBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		padding: 12,
		backgroundColor: '#ECFDF5',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: CustomColors.lightGreen,
		marginTop: 12,
	},
	appliedCouponText: {
		flex: 1,
		fontSize: 13,
		color: CustomColors.lightGreen,
		fontWeight: '500',
	},
	loadingContainer: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 14,
		color: '#666666',
	},
	noSlotsContainer: {
		paddingVertical: 20,
		alignItems: 'center',
		backgroundColor: '#FFF3CD',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#FFD700',
	},
	noSlotsText: {
		fontSize: 14,
		color: '#856404',
		fontWeight: '500',
	},
	labelOptions: {
		flexDirection: 'row',
		gap: 8,
	},
	labelOption: {
		flex: 1,
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},
	labelOptionActive: {
		borderColor: CustomColors.darkBrown,
		backgroundColor: CustomColors.lightBrown,
	},
	labelOptionText: {
		fontSize: 14,
		color: '#666666',
		fontWeight: '500',
	},
	labelOptionTextActive: {
		color: CustomColors.darkBrown,
		fontWeight: '600',
	},
	formField: {
		marginBottom: 16,
	},
	dropdownButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderRadius: 8,
		padding: 12,
		backgroundColor: '#FFFFFF',
	},
	dropdownText: {
		fontSize: 16,
		color: '#000000',
	},
	placeholderText: {
		color: '#999999',
	},
	dropdownMenu: {
		position: 'absolute',
		top: 50,
		left: 0,
		right: 0,
		backgroundColor: '#FFFFFF',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		maxHeight: 200,
		zIndex: 1000,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	dropdownScroll: {
		maxHeight: 200,
	},
	dropdownItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	dropdownItemText: {
		fontSize: 15,
		color: '#333333',
	},
	textarea: {
		height: 80,
		paddingTop: 12,
	},
	disabledOption: {
		opacity: 0.5,
		backgroundColor: '#F5F5F5',
	},
	disabledText: {
		color: '#999999',
	},
	disabledInput: {
		backgroundColor: '#F5F5F5',
	},
	disabledMessage: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		padding: 10,
		backgroundColor: '#F0F0F0',
		borderRadius: 6,
		marginBottom: 12,
	},
	disabledMessageText: {
		fontSize: 13,
		color: '#666666',
		fontStyle: 'italic',
	},
});
