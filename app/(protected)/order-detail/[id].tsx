import { IconSymbol } from '@/components/ui/icon-symbol';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OrderItem = {
	id: string;
	name: string;
	quantity: number;
	price: number;
	image: string;
};

type Order = {
	id: string;
	orderNumber: string;
	date: string;
	status: 'pending' | 'confirmed' | 'delivering' | 'delivered' | 'cancelled';
	items: OrderItem[];
	total: number;
	subtotal: number;
	deliveryFee: number;
	vat: number;
	discount: number;
	deliveryAddress: string;
	deliveryTime: string;
	paymentMethod: string;
	paymentStatus: 'paid' | 'pending' | 'failed';
	notes?: string;
	contactNumber: string;
};

// Mock data - in real app, fetch based on order ID
const mockOrders: Record<string, Order> = {
	ord1: {
		id: 'ord1',
		orderNumber: '#12345',
		date: '2025-11-13',
		status: 'delivering',
		items: [
			{
				id: '1',
				name: 'Basmati Rice',
				quantity: 2,
				price: 150,
				image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
			},
			{
				id: '2',
				name: 'Fresh Tomatoes',
				quantity: 1,
				price: 80,
				image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=200&h=200&fit=crop',
			},
			{
				id: '3',
				name: 'Chicken Breast',
				quantity: 1,
				price: 350,
				image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop',
			},
		],
		subtotal: 580,
		deliveryFee: 50,
		vat: 63,
		discount: 30,
		total: 663,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka 1209',
		deliveryTime: 'Today, 4:00 PM - 5:00 PM',
		paymentMethod: 'bKash',
		paymentStatus: 'paid',
		notes: 'Please ring the doorbell',
		contactNumber: '+880 1828398225',
	},
	ord2: {
		id: 'ord2',
		orderNumber: '#12344',
		date: '2025-11-13',
		status: 'confirmed',
		items: [
			{
				id: '4',
				name: 'Milk',
				quantity: 2,
				price: 85,
				image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
			},
			{
				id: '5',
				name: 'Whole Wheat Bread',
				quantity: 1,
				price: 45,
				image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
			},
		],
		subtotal: 215,
		deliveryFee: 50,
		vat: 26.5,
		discount: 0,
		total: 291.5,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka 1209',
		deliveryTime: 'Tomorrow, 10:00 AM - 11:00 AM',
		paymentMethod: 'Cash on Delivery',
		paymentStatus: 'pending',
		contactNumber: '+880 1828398225',
	},
	ord3: {
		id: 'ord3',
		orderNumber: '#12340',
		date: '2025-11-10',
		status: 'delivered',
		items: [
			{
				id: '6',
				name: 'Basmati Rice',
				quantity: 1,
				price: 150,
				image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop',
			},
			{
				id: '7',
				name: 'Cooking Oil',
				quantity: 1,
				price: 180,
				image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop',
			},
			{
				id: '8',
				name: 'Onions',
				quantity: 1,
				price: 40,
				image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cbe?w=200&h=200&fit=crop',
			},
			{
				id: '9',
				name: 'Potatoes',
				quantity: 1,
				price: 40,
				image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=200&fit=crop',
			},
		],
		subtotal: 410,
		deliveryFee: 50,
		vat: 46,
		discount: 50,
		total: 456,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka 1209',
		deliveryTime: '10 Nov 2025, 3:00 PM - 4:00 PM',
		paymentMethod: 'Nagad',
		paymentStatus: 'paid',
		notes: 'Call before delivery',
		contactNumber: '+880 1828398225',
	},
	ord4: {
		id: 'ord4',
		orderNumber: '#12335',
		date: '2025-11-08',
		status: 'delivered',
		items: [
			{
				id: '10',
				name: 'Fresh Vegetables Mix',
				quantity: 1,
				price: 120,
				image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop',
			},
			{
				id: '11',
				name: 'Yogurt',
				quantity: 2,
				price: 65,
				image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
			},
			{
				id: '12',
				name: 'Eggs (12 pcs)',
				quantity: 1,
				price: 95,
				image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop',
			},
		],
		subtotal: 345,
		deliveryFee: 50,
		vat: 39.5,
		discount: 0,
		total: 434.5,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka 1209',
		deliveryTime: '08 Nov 2025, 5:00 PM - 6:00 PM',
		paymentMethod: 'Credit Card',
		paymentStatus: 'paid',
		contactNumber: '+880 1828398225',
	},
	ord5: {
		id: 'ord5',
		orderNumber: '#12330',
		date: '2025-11-05',
		status: 'delivered',
		items: [
			{
				id: '13',
				name: 'Chicken Biryani Masala',
				quantity: 1,
				price: 85,
				image: 'https://images.unsplash.com/photo-1596040033229-a0b34e5e5a88?w=200&h=200&fit=crop',
			},
			{
				id: '14',
				name: 'Ghee',
				quantity: 1,
				price: 180,
				image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
			},
		],
		subtotal: 265,
		deliveryFee: 50,
		vat: 31.5,
		discount: 20,
		total: 326.5,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka 1209',
		deliveryTime: '05 Nov 2025, 2:00 PM - 3:00 PM',
		paymentMethod: 'bKash',
		paymentStatus: 'paid',
		contactNumber: '+880 1828398225',
	},
};

const getStatusColor = (status: Order['status']) => {
	switch (status) {
		case 'pending':
			return '#F59E0B';
		case 'confirmed':
			return '#3B82F6';
		case 'delivering':
			return '#8B5CF6';
		case 'delivered':
			return '#10B981';
		case 'cancelled':
			return '#EF4444';
		default:
			return '#666666';
	}
};

const getStatusText = (status: Order['status']) => {
	switch (status) {
		case 'pending':
			return 'Pending';
		case 'confirmed':
			return 'Confirmed';
		case 'delivering':
			return 'Out for Delivery';
		case 'delivered':
			return 'Delivered';
		case 'cancelled':
			return 'Cancelled';
		default:
			return status;
	}
};

const getPaymentStatusColor = (status: Order['paymentStatus']) => {
	switch (status) {
		case 'paid':
			return '#10B981';
		case 'pending':
			return '#F59E0B';
		case 'failed':
			return '#EF4444';
		default:
			return '#666666';
	}
};

const getPaymentStatusText = (status: Order['paymentStatus']) => {
	switch (status) {
		case 'paid':
			return 'Paid';
		case 'pending':
			return 'Pending';
		case 'failed':
			return 'Failed';
		default:
			return status;
	}
};

export default function OrderDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const order = mockOrders[id || 'ord1'];

	if (!order) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.errorContainer}>
					<Text style={styles.errorText}>Order not found</Text>
					<Pressable
						style={styles.backButtonError}
						onPress={() => router.back()}>
						<Text style={styles.backButtonErrorText}>Go Back</Text>
					</Pressable>
				</View>
			</SafeAreaView>
		);
	}

	const statusColor = getStatusColor(order.status);
	const statusText = getStatusText(order.status);
	const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);
	const paymentStatusText = getPaymentStatusText(order.paymentStatus);

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					style={styles.backButton}>
					<IconSymbol
						name='chevron.left'
						size={24}
						color='#000000'
					/>
				</Pressable>
				<Text style={styles.headerTitle}>Order Details</Text>
				<View style={{ width: 40 }} />
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}>
				{/* Order Status Card */}
				<View style={styles.statusCard}>
					<View style={styles.statusHeader}>
						<View>
							<Text style={styles.orderNumber}>{order.orderNumber}</Text>
							<Text style={styles.orderDate}>{order.date}</Text>
						</View>
						<View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
							<Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
						</View>
					</View>
				</View>

				{/* Delivery Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Delivery Information</Text>
					<View style={styles.infoCard}>
						<View style={styles.infoRow}>
							<IconSymbol
								name='mappin.circle.fill'
								size={20}
								color='#E63946'
							/>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Delivery Address</Text>
								<Text style={styles.infoValue}>{order.deliveryAddress}</Text>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<IconSymbol
								name='clock.fill'
								size={20}
								color='#E63946'
							/>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Delivery Time</Text>
								<Text style={styles.infoValue}>{order.deliveryTime}</Text>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<IconSymbol
								name='phone.fill'
								size={20}
								color='#E63946'
							/>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Contact Number</Text>
								<Text style={styles.infoValue}>{order.contactNumber}</Text>
							</View>
						</View>

						{order.notes && (
							<>
								<View style={styles.divider} />
								<View style={styles.infoRow}>
									<IconSymbol
										name='note.text'
										size={20}
										color='#E63946'
									/>
									<View style={styles.infoContent}>
										<Text style={styles.infoLabel}>Delivery Notes</Text>
										<Text style={styles.infoValue}>{order.notes}</Text>
									</View>
								</View>
							</>
						)}
					</View>
				</View>

				{/* Payment Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment Information</Text>
					<View style={styles.infoCard}>
						<View style={styles.infoRow}>
							<IconSymbol
								name='creditcard.fill'
								size={20}
								color='#E63946'
							/>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Payment Method</Text>
								<Text style={styles.infoValue}>{order.paymentMethod}</Text>
							</View>
						</View>

						<View style={styles.divider} />

						<View style={styles.infoRow}>
							<IconSymbol
								name='checkmark.circle.fill'
								size={20}
								color={paymentStatusColor}
							/>
							<View style={styles.infoContent}>
								<Text style={styles.infoLabel}>Payment Status</Text>
								<View
									style={[
										styles.paymentStatusBadge,
										{ backgroundColor: `${paymentStatusColor}15` },
									]}>
									<Text style={[styles.paymentStatusText, { color: paymentStatusColor }]}>
										{paymentStatusText}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				{/* Items Ordered */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Items Ordered ({order.items.length})</Text>
					<View style={styles.itemsCard}>
						{order.items.map((item, index) => (
							<View key={item.id}>
								<View style={styles.itemRow}>
									<Image
										source={{ uri: item.image }}
										style={styles.itemImage}
									/>
									<View style={styles.itemInfo}>
										<Text style={styles.itemName}>{item.name}</Text>
										<Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
										<Text style={styles.itemPrice}>৳{item.price} each</Text>
									</View>
									<Text style={styles.itemTotal}>৳{item.price * item.quantity}</Text>
								</View>
								{index < order.items.length - 1 && <View style={styles.divider} />}
							</View>
						))}
					</View>
				</View>

				{/* Order Summary */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Order Summary</Text>
					<View style={styles.summaryCard}>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Subtotal</Text>
							<Text style={styles.summaryValue}>৳{order.subtotal}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Delivery Fee</Text>
							<Text style={styles.summaryValue}>৳{order.deliveryFee}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>VAT</Text>
							<Text style={styles.summaryValue}>৳{order.vat}</Text>
						</View>
						{order.discount > 0 && (
							<View style={styles.summaryRow}>
								<Text style={styles.summaryLabel}>Discount</Text>
								<Text style={[styles.summaryValue, styles.discountValue]}>-৳{order.discount}</Text>
							</View>
						)}
						<View style={styles.divider} />
						<View style={styles.summaryRow}>
							<Text style={styles.totalLabel}>Total</Text>
							<Text style={styles.totalValue}>৳{order.total}</Text>
						</View>
					</View>
				</View>

				{/* Bottom Spacing */}
				<View style={{ height: 40 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
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
	scrollView: {
		flex: 1,
	},
	statusCard: {
		backgroundColor: '#FFFFFF',
		padding: 20,
		marginBottom: 12,
	},
	statusHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	orderNumber: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 4,
	},
	orderDate: {
		fontSize: 14,
		color: '#666666',
	},
	statusBadge: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	statusText: {
		fontSize: 13,
		fontWeight: '600',
	},
	section: {
		marginBottom: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: '#F5F5F5',
	},
	infoCard: {
		backgroundColor: '#FFFFFF',
		padding: 20,
	},
	infoRow: {
		flexDirection: 'row',
		gap: 12,
	},
	infoContent: {
		flex: 1,
	},
	infoLabel: {
		fontSize: 13,
		color: '#666666',
		marginBottom: 4,
	},
	infoValue: {
		fontSize: 15,
		color: '#000000',
		fontWeight: '500',
	},
	divider: {
		height: 1,
		backgroundColor: '#F0F0F0',
		marginVertical: 16,
	},
	paymentStatusBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		marginTop: 4,
	},
	paymentStatusText: {
		fontSize: 13,
		fontWeight: '600',
	},
	itemsCard: {
		backgroundColor: '#FFFFFF',
		padding: 20,
	},
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
		marginRight: 12,
	},
	itemInfo: {
		flex: 1,
	},
	itemName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 4,
	},
	itemQuantity: {
		fontSize: 13,
		color: '#666666',
		marginBottom: 2,
	},
	itemPrice: {
		fontSize: 13,
		color: '#999999',
	},
	itemTotal: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#E63946',
	},
	summaryCard: {
		backgroundColor: '#FFFFFF',
		padding: 20,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
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
	discountValue: {
		color: '#10B981',
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
	},
	totalValue: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#E63946',
	},
	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	errorText: {
		fontSize: 18,
		color: '#666666',
		marginBottom: 20,
	},
	backButtonError: {
		backgroundColor: '#E63946',
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 8,
	},
	backButtonErrorText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
});
