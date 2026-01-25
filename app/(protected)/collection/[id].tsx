import { ProductCard } from '@/components/product-card';
import { ProductCardSkeleton } from '@/components/skeleton/ProductCardSkeleton';
import { SubCategorySkeleton } from '@/components/skeleton/SubCategorySkeleton';
import { SubCategoryCard } from '@/components/SubCategoryCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery, useGetByIdQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router, useLocalSearchParams } from 'expo-router';

import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { CustomColors } from '@/constants/theme';

const fallback = require('../../../assets/images/splash-icon.png');

export default function CollectionScreen() {
	const dispatch = useDispatch();
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: collection, isLoading: isCollectionLoading } = useGetByIdQuery(
		{
			path: 'collections',
			id,
		},
		{ skip: !id || id === 'undefined' },
	);

	// Collections don't typically have dynamic subcategories in this UI, but we keep parity
	const hasSubcategories = false;

	// Pagination state
	const [allProducts, setAllProducts] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const scrollY = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef<FlatList>(null);

	const { data: productsData, isFetching: productsDataLoading } =
		useGetAllQuery(
			{
				path: 'products',
				sort: '-priority',
				page: page,
				limit: 10,
				filters: {
					collection_in: id,
					isActive: true,
				},
			},
			{ skip: !id || id === 'undefined' },
		);

	useEffect(() => {
		// Reset state when collection ID changes
		setAllProducts([]);
		setPage(1);
		setHasMore(true);
	}, [id]);

	useEffect(() => {
		if (productsData?.doc) {
			if (page === 1) {
				setAllProducts(productsData.doc);
			} else {
				setAllProducts(prev => [...prev, ...productsData.doc]);
			}
			setHasMore(productsData.doc.length === 10);
		}
	}, [productsData]);

	const handleBack = () => {
		router.back();
	};

	const handleProductPress = (productId: string) => {
		router.push(`/product/${productId}`);
	};

	const handleAddPress = (product: any) => {
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
	};

	const handleLoadMore = () => {
		if (hasMore && !productsDataLoading) {
			setPage(prev => prev + 1);
		}
	};

	const scrollToTop = () => {
		flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
	};

	const buttonOpacity = scrollY.interpolate({
		inputRange: [0, 100, 300],
		outputRange: [0, 0, 1],
		extrapolate: 'clamp',
	});

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={handleBack}
						activeOpacity={0.7}
					>
						<IconSymbol name='chevron.left' size={24} color='#000' />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>
						{collection?.name || 'Collection'}
					</Text>
					<View style={styles.headerSpacer} />
				</View>

				{hasSubcategories ? (
					<ScrollView
						style={styles.scrollView}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.section}>
							<View style={styles.categoriesGrid}>
								{/* Placeholder for future expansion */}
							</View>
						</View>
					</ScrollView>
				) : (
					<View style={{ flex: 1 }}>
						<FlatList
							ref={flatListRef}
							data={allProducts}
							keyExtractor={item => item.id}
							numColumns={2}
							columnWrapperStyle={styles.columnWrapper}
							contentContainerStyle={styles.listContainer}
							renderItem={({ item }) => (
								<View style={styles.productCardWrapper}>
									<ProductCard
										product={item}
										id={item.id}
										name={item.name}
										price={item.price}
										unit={item.unit}
										unitPrice={item.unitPrice}
										badge={item.badge}
										badgeIcon={item.badgeIcon}
										image={item.image}
										onPress={() => handleProductPress(item.id)}
										onAddPress={() => handleAddPress(item)}
									/>
								</View>
							)}
							ListEmptyComponent={() => (
								<>
									{productsDataLoading && page === 1 ? (
										<View style={styles.productsGrid}>
											{Array.from({ length: 6 }).map((_, index) => (
												<View
													key={`skeleton-${index}`}
													style={styles.productCardWrapper}
												>
													<ProductCardSkeleton />
												</View>
											))}
										</View>
									) : (
										!productsDataLoading && (
											<View style={styles.emptyStateContainer}>
												<IconSymbol
													name='cart.fill'
													size={64}
													color='#8B4513'
												/>
												<Text style={styles.emptyStateText}>
													No Products Found
												</Text>
												<Text style={styles.emptyStateSubtext}>
													Check back later for new items
												</Text>
											</View>
										)
									)}
								</>
							)}
							ListFooterComponent={() => (
								<>
									{productsDataLoading && page > 1 && (
										<View style={styles.footerLoader}>
											<ActivityIndicator
												size='small'
												color={CustomColors.darkBrown}
											/>
										</View>
									)}
								</>
							)}
							onEndReached={handleLoadMore}
							onEndReachedThreshold={0.5}
							onScroll={Animated.event(
								[{ nativeEvent: { contentOffset: { y: scrollY } } }],
								{ useNativeDriver: false },
							)}
							scrollEventThrottle={16}
							showsVerticalScrollIndicator={false}
						/>

						<Animated.View
							style={[styles.backToTopButton, { opacity: buttonOpacity }]}
						>
							<TouchableOpacity
								onPress={scrollToTop}
								activeOpacity={0.8}
								style={styles.backToTopInner}
							>
								<IconSymbol name='chevron.up' size={24} color='#FFF' />
							</TouchableOpacity>
						</Animated.View>
					</View>
				)}
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	backButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
	},
	headerSpacer: {
		width: 40,
	},
	scrollView: {
		flex: 1,
	},
	section: {
		padding: 16,
	},
	categoriesGrid: {
		gap: 12,
	},
	subcategoryCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FAFAFA',
		padding: 12,
		borderRadius: 12,
		gap: 12,
	},
	subcategoryImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
	},
	subcategoryName: {
		flex: 1,
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	productsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	productCardWrapper: {
		width: '48%',
		marginBottom: 12,
	},
	emptyStateContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 80,
		gap: 12,
	},
	emptyStateText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#8B4513',
		marginTop: 8,
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: '#A0826D',
		marginTop: 4,
	},
	listContainer: {
		padding: 16,
	},
	columnWrapper: {
		justifyContent: 'space-between',
	},
	footerLoader: {
		paddingVertical: 16,
		alignItems: 'center',
	},
	backToTopButton: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		zIndex: 100,
	},
	backToTopInner: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: CustomColors.darkBrown,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});
