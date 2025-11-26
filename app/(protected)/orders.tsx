import { IconSymbol } from '@/components/ui/icon-symbol';
import { addToCart } from '@/store/slices/cartSlice';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

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
	deliveryAddress: string;
};

const mockOngoingOrders: Order[] = [
	{
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
		total: 730,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka',
	},
	{
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
		total: 215,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka',
	},
];

const mockPastOrders: Order[] = [
	{
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
		total: 410,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka',
	},
	{
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
		total: 345,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka',
	},
	{
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
		total: 265,
		deliveryAddress: 'House 45, Road 12, Dhanmondi, Dhaka',
	},
];

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

type OrderCardProps = {
	order: Order;
	showReorderButton?: boolean;
	onReorder?: (order: Order) => void;
	onPress?: (orderId: string) => void;
};

const OrderCard = ({ order, showReorderButton = false, onReorder, onPress }: OrderCardProps) => {
	const statusColor = getStatusColor(order.status);
	const statusText = getStatusText(order.status);

	return (
		<Pressable
			style={styles.orderCard}
			onPress={() => onPress?.(order.id)}>
			{/* Order Header */}
			<View style={styles.orderHeader}>
				<View>
					<Text style={styles.orderNumber}>{order.orderNumber}</Text>
					<Text style={styles.orderDate}>{order.date}</Text>
				</View>
				<View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
					<Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
				</View>
			</View>

			{/* Order Items Preview */}
			<View style={styles.itemsPreview}>
				{order.items.slice(0, 3).map((item, index) => (
					<View
						key={item.id}
						style={styles.itemRow}>
						<Image
							source={{ uri: item.image }}
							style={styles.itemImage}
						/>
						<View style={styles.itemInfo}>
							<Text
								style={styles.itemName}
								numberOfLines={1}>
								{item.name}
							</Text>
							<Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
						</View>
						<Text style={styles.itemPrice}>৳{item.price * item.quantity}</Text>
					</View>
				))}
				{order.items.length > 3 && (
					<Text style={styles.moreItems}>+{order.items.length - 3} more items</Text>
				)}
			</View>

			{/* Order Footer */}
			<View style={styles.orderFooter}>
				<View style={styles.totalSection}>
					<Text style={styles.totalLabel}>Total</Text>
					<Text style={styles.totalAmount}>৳{order.total}</Text>
				</View>

				{showReorderButton && (
					<Pressable
						style={styles.reorderButton}
						onPress={e => {
							e.stopPropagation();
							onReorder?.(order);
						}}>
						<IconSymbol
							name='arrow.clockwise'
							size={16}
							color='#E63946'
						/>
						<Text style={styles.reorderButtonText}>Reorder</Text>
					</Pressable>
				)}
			</View>
		</Pressable>
	);
};

export default function OrdersScreen() {
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');

	const handleOrderPress = (orderId: string) => {
		router.push(`/order-detail/${orderId}`);
	};

	const handleReorder = (order: Order) => {
		// Add all items from the order to cart
		order.items.forEach(item => {
			dispatch(
				addToCart({
					item: {
						id: item.id,
						_id: item.id,
						name: item.name,
						price: item.price,
						image: item.image,
						vat: 0,
					},
					qty: item.quantity,
				})
			);
		});

		// Navigate to cart
		router.push('/(tabs)/cart');
	};

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
				<Text style={styles.headerTitle}>My Orders</Text>
				<View style={{ width: 40 }} />
			</View>

			{/* Tabs */}
			<View style={styles.tabContainer}>
				<Pressable
					style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
					onPress={() => setActiveTab('ongoing')}>
					<Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
						Ongoing ({mockOngoingOrders.length})
					</Text>
				</Pressable>
				<Pressable
					style={[styles.tab, activeTab === 'past' && styles.activeTab]}
					onPress={() => setActiveTab('past')}>
					<Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
						Past Orders ({mockPastOrders.length})
					</Text>
				</Pressable>
			</View>

			{/* Orders List */}
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}>
				{activeTab === 'ongoing' ? (
					<View style={styles.ordersContainer}>
						{mockOngoingOrders.length === 0 ? (
							<View style={styles.emptyState}>
								<IconSymbol
									name='tray'
									size={64}
									color='#D0D0D0'
								/>
								<Text style={styles.emptyStateText}>No ongoing orders</Text>
							</View>
						) : (
							mockOngoingOrders.map(order => (
								<OrderCard
									key={order.id}
									order={order}
									onPress={handleOrderPress}
								/>
							))
						)}
					</View>
				) : (
					<View style={styles.ordersContainer}>
						{mockPastOrders.length === 0 ? (
							<View style={styles.emptyState}>
								<IconSymbol
									name='tray'
									size={64}
									color='#D0D0D0'
								/>
								<Text style={styles.emptyStateText}>No past orders</Text>
							</View>
						) : (
							mockPastOrders.map(order => (
								<OrderCard
									key={order.id}
									order={order}
									showReorderButton={true}
									onReorder={handleReorder}
									onPress={handleOrderPress}
								/>
							))
						)}
					</View>
				)}

				{/* Bottom Spacing */}
				<View style={{ height: 40 }} />
			</ScrollView>
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
	tabContainer: {
		flexDirection: 'row',
		backgroundColor: '#F5F5F5',
		marginHorizontal: 16,
		marginTop: 16,
		borderRadius: 12,
		padding: 4,
	},
	tab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: 'center',
		borderRadius: 8,
	},
	activeTab: {
		backgroundColor: '#FFFFFF',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	tabText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#666666',
	},
	activeTabText: {
		color: '#000000',
	},
	scrollView: {
		flex: 1,
	},
	ordersContainer: {
		padding: 16,
	},
	orderCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	orderHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	orderNumber: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 4,
	},
	orderDate: {
		fontSize: 13,
		color: '#666666',
	},
	statusBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
	},
	itemsPreview: {
		marginBottom: 16,
	},
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	itemImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
		marginRight: 12,
	},
	itemInfo: {
		flex: 1,
	},
	itemName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 4,
	},
	itemQuantity: {
		fontSize: 12,
		color: '#666666',
	},
	itemPrice: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#E63946',
	},
	moreItems: {
		fontSize: 13,
		color: '#666666',
		fontStyle: 'italic',
		marginTop: 4,
	},
	orderFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#F0F0F0',
	},
	totalSection: {
		flex: 1,
	},
	totalLabel: {
		fontSize: 13,
		color: '#666666',
		marginBottom: 4,
	},
	totalAmount: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	reorderButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: '#FEF2F2',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E63946',
	},
	reorderButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#E63946',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 80,
	},
	emptyStateText: {
		fontSize: 16,
		color: '#999999',
		marginTop: 16,
	},
});
