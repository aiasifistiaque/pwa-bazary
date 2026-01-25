import { IconSymbol } from '@/components/ui/icon-symbol';
import { Toast } from '@/components/ui/Toast';
import { CustomColors } from '@/constants/theme';
import { useGetSelfQuery } from '@/store/services/authApi';
import { useGetOrdersQuery } from '@/store/services/checkoutApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

const OrderCard = ({ order, showReorderButton = true, onReorder, onPress }: OrderCardProps) => {
	const statusColor = getStatusColor(order.status);
	const statusText = getStatusText(order.status);
	const fallbackImage = 'https://via.placeholder.com/200'; // Fallback image

	const [isExpanded, setIsExpanded] = useState(false);
	const animatedHeight = useRef(new Animated.Value(0)).current;
	const hasMoreItems = order.items.length > 3;

	useEffect(() => {
		Animated.timing(animatedHeight, {
			toValue: isExpanded ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [isExpanded]);

	const toggleExpand = (e: any) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	const displayedItems = isExpanded ? order.items : order.items.slice(0, 3);

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
				{displayedItems?.map((item, index) => (
					<View
						key={index}
						style={styles.itemRow}>
						<Image
							source={{ uri: item.image || fallbackImage }}
							style={styles.itemImage}
						/>
						<View style={styles.itemInfo}>
							<Text
								style={styles.itemName}
								numberOfLines={1}>
								{item.name}
							</Text>
							<Text style={styles.itemQuantity}>Qty: {item?.quantity}</Text>
						</View>
						<Text style={styles.itemPrice}>
							৳{(item?.price * item?.quantity)?.toLocaleString()}
						</Text>
					</View>
				))}

				{hasMoreItems && (
					<Pressable
						onPress={toggleExpand}
						style={styles.expandButton}>
						<Text style={styles.expandButtonText}>
							{isExpanded ? 'Show less' : `+${order.items.length - 3} more items`}
						</Text>
						<IconSymbol
							name={isExpanded ? 'chevron.up' : 'chevron.down'}
							size={16}
							color={CustomColors.darkBrown}
						/>
					</Pressable>
				)}
			</View>

			{/* Order Footer */}
			<View style={styles.orderFooter}>
				<View style={styles.totalSection}>
					<Text style={styles.totalLabel}>Total</Text>
					<Text style={styles.totalAmount}>৳{order?.total?.toLocaleString()}</Text>
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
							color={CustomColors.darkBrown}
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
	const [toastVisible, setToastVisible] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [activeTab, setActiveTab] = useState<'ongoing' | 'past'>('ongoing');

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [allOrders, setAllOrders] = useState<Order[]>([]);

	// Get logged-in user
	const { data: userData } = useGetSelfQuery({});
	const loggedInUserId = userData?._id;

	const { data, isLoading, isFetching } = useGetOrdersQuery({
		storeId: 'default',
		page: currentPage,
		limit: 10,
	});

	// Update allOrders when new data arrives
	useEffect(() => {
		if (data?.doc && loggedInUserId) {
			// Filter orders to only show logged-in user's orders
			const userOrders = data.doc.filter((order: any) => {
				const customerId =
					typeof order.customer === 'object' ? order.customer?._id : order.customer;
				return customerId === loggedInUserId;
			});

			const newOrders: Order[] = userOrders.map((order: any) => ({
				id: order._id,
				orderNumber: order.invoice ? `#${order.invoice}` : `#${order._id.slice(-6)}`,
				date: new Date(order.orderDate).toISOString().split('T')[0],
				status: order.status,
				items: order.items.map((item: any) => ({
					id: item.product?._id || item.product || item.productId || item._id,
					name: item.name,
					quantity: item.qty,
					price: item.unitPrice,
					image: item.image,
				})),
				total: order.total,
				deliveryAddress: order.address
					? `${order.address.street || ''}, ${order.address.city || ''}`
					: 'N/A',
			}));

			if (currentPage === 1) {
				// First page - replace all orders
				setAllOrders(newOrders);
			} else {
				// Subsequent pages - append to existing orders
				setAllOrders(prev => [...prev, ...newOrders]);
			}
		}
	}, [data, currentPage, loggedInUserId]);

	// Show Load More button only if:
	// 1. We have loaded at least 10 orders (meaning there might be more)
	// 2. Current page is less than total pages (there are more pages to fetch)
	const hasMore = data ? allOrders.length >= 10 && currentPage < data.totalPages : false;

	const ongoingOrders = allOrders.filter(order =>
		[
			'pending',
			'confirmed',
			'delivering',
			'processing',
			'ready-to-ship',
			'out-for-delivery',
		].includes(order.status),
	);
	const pastOrders = allOrders.filter(order =>
		['delivered', 'cancelled', 'completed', 'refunded', 'failed'].includes(order.status),
	);

	// Reset pagination when switching tabs
	const handleTabChange = (tab: 'ongoing' | 'past') => {
		setActiveTab(tab);
		setCurrentPage(1);
		setAllOrders([]);
	};

	const handleLoadMore = () => {
		if (!isFetching && hasMore) {
			setCurrentPage(prev => prev + 1);
		}
	};

	const handleOrderPress = (orderId: string) => {
		// router.push(`/order-detail/${orderId}`);
	};

	const handleReorder = (order: Order) => {
		console.log('Reordering items:', order.items); // Debug log

		// Add all items from the order to cart
		order.items.forEach(item => {
			console.log('Adding item to cart:', item); // Debug log

			// Extract the actual product ID from the object
			const productId = typeof item.id === 'object' ? (item.id as any)._id : item.id;

			dispatch(
				addToCart({
					item: {
						id: productId,
						_id: productId,
						name: item.name,
						price: item.price,
						image: item.image,
						vat: 0,
					},
					qty: item.quantity,
				}),
			);
		});

		// Show toast notification
		setToastMessage(
			`${order.items.length} item${order.items.length > 1 ? 's' : ''} added to cart!`,
		);
		setToastVisible(true);
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
					onPress={() => handleTabChange('ongoing')}>
					<Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
						Ongoing ({ongoingOrders.length})
					</Text>
				</Pressable>
				<Pressable
					style={[styles.tab, activeTab === 'past' && styles.activeTab]}
					onPress={() => handleTabChange('past')}>
					<Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
						Past Orders ({pastOrders.length})
					</Text>
				</Pressable>
			</View>

			{/* Orders List */}
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}>
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator
							size='large'
							color={CustomColors.darkBrown}
						/>
					</View>
				) : activeTab === 'ongoing' ? (
					<View style={styles.ordersContainer}>
						{ongoingOrders.length === 0 ? (
							<View style={styles.emptyState}>
								<IconSymbol
									name='tray'
									size={64}
									color='#D0D0D0'
								/>
								<Text style={styles.emptyStateText}>No ongoing orders</Text>
							</View>
						) : (
							ongoingOrders.map(order => (
								<OrderCard
									key={order.id}
									order={order}
									onReorder={handleReorder}
									onPress={handleOrderPress}
								/>
							))
						)}

						{/* Load More Button */}
						{hasMore && ongoingOrders.length > 0 && (
							<Pressable
								style={styles.loadMoreButton}
								onPress={handleLoadMore}
								disabled={isFetching}>
								{isFetching ? (
									<ActivityIndicator
										size='small'
										color={CustomColors.darkBrown}
									/>
								) : (
									<Text style={styles.loadMoreText}>Load More</Text>
								)}
							</Pressable>
						)}
					</View>
				) : (
					<View style={styles.ordersContainer}>
						{pastOrders.length === 0 ? (
							<View style={styles.emptyState}>
								<IconSymbol
									name='tray'
									size={64}
									color='#D0D0D0'
								/>
								<Text style={styles.emptyStateText}>No past orders</Text>
							</View>
						) : (
							pastOrders.map(order => (
								<OrderCard
									key={order.id}
									order={order}
									showReorderButton={true}
									onReorder={handleReorder}
									onPress={handleOrderPress}
								/>
							))
						)}

						{/* Load More Button */}
						{hasMore && pastOrders.length > 0 && (
							<Pressable
								style={styles.loadMoreButton}
								onPress={handleLoadMore}
								disabled={isFetching}>
								{isFetching ? (
									<ActivityIndicator
										size='small'
										color={CustomColors.darkBrown}
									/>
								) : (
									<Text style={styles.loadMoreText}>Load More</Text>
								)}
							</Pressable>
						)}
					</View>
				)}

				{/* Bottom Spacing */}
				<View style={{ height: 40 }} />
			</ScrollView>

			{/* Toast Notification */}
			<Toast
				message={toastMessage}
				visible={toastVisible}
				onDismiss={() => setToastVisible(false)}
			/>
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
		color: CustomColors.darkBrown,
	},
	expandButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		marginTop: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: CustomColors.darkBrown,
	},
	expandButtonText: {
		fontSize: 13,
		color: CustomColors.darkBrown,
		fontWeight: '600',
	},
	orderFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: CustomColors.lightBrown,
	},
	totalSection: {
		flex: 1,
	},
	totalLabel: {
		fontSize: 13,
		color: CustomColors.darkBrown,
		marginBottom: 4,
	},
	totalAmount: {
		fontSize: 18,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
	},
	reorderButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: CustomColors.lightBrown,
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: CustomColors.darkBrown,
	},
	reorderButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: CustomColors.darkBrown,
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
	loadMoreButton: {
		marginHorizontal: 16,
		marginTop: 16,
		marginBottom: 8,
		paddingVertical: 12,
		backgroundColor: CustomColors.lightBrown,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: CustomColors.darkBrown,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 48,
	},
	loadMoreText: {
		fontSize: 14,
		fontWeight: '600',
		color: CustomColors.darkBrown,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 50,
	},
});
