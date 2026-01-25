import { HorizontalProductCard } from '@/components/HorizontalProductCard';
import { SubCategorySkeleton } from '@/components/skeleton/SubCategorySkeleton';
import { SubCategoryCard } from '@/components/SubCategoryCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery, useGetByIdQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router, useLocalSearchParams } from 'expo-router';

import { CustomColors } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const fallback = require('../../../assets/images/splash-icon.png');

export default function CategoryScreen() {
	const dispatch = useDispatch();
	const { id } = useLocalSearchParams<{ id: string }>();

	const { data: catName, isLoading: isCatNameLoading } = useGetByIdQuery({
		path: 'categorys',
		id,
	});

	// get the categories based on if id
	const { data: childCategories, isLoading: childCatLoading } = useGetAllQuery({
		path: 'categorys',
		filters: { parentCategory: id },
	});

	const hasSubcategories = childCategories?.doc?.length > 0 || childCatLoading;

	// Pagination state
	const [allProducts, setAllProducts] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const scrollY = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef<FlatList>(null);
	const cartAnim = useRef(new Animated.Value(1)).current;

	const { data: productsData, isFetching: productsDataLoading } = useGetAllQuery(
		{
			path: 'products',
			sort: '-priority',
			page: page,
			limit: 10,
			filters: {
				category_in: id,
				isActive: true,
			},
		},
		{ skip: !id },
	);

	useEffect(() => {
		if (!productsDataLoading && allProducts.length === 0) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(cartAnim, {
						toValue: 1.1,
						duration: 1000,
						useNativeDriver: true,
					}),
					Animated.timing(cartAnim, {
						toValue: 1,
						duration: 1000,
						useNativeDriver: true,
					}),
				]),
			).start();
		}
	}, [productsDataLoading, allProducts]);

	useEffect(() => {
		// Reset state when category ID changes
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

	const handleBack = () => {
		router.back();
	};

	const handleSubcategoryPress = (subcategoryId: string) => {
		router.push(`/category/${subcategoryId}`);
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

	// Removed explicit return Loader here to show skeletons inline

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={handleBack}
						activeOpacity={0.7}>
						<IconSymbol
							name='chevron.left'
							size={24}
							color='#000'
						/>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{catName?.name}</Text>
					<View style={styles.headerSpacer} />
				</View>

				{hasSubcategories ? (
					<ScrollView
						style={styles.scrollView}
						showsVerticalScrollIndicator={false}>
						<View style={styles.section}>
							<View style={styles.categoriesGrid}>
								{childCatLoading
									? Array.from({ length: 10 }).map((_, index) => (
											<SubCategorySkeleton key={`sub-skeleton-${index}`} />
										))
									: childCategories?.doc?.map((subcategory: any) => (
											<SubCategoryCard
												key={subcategory.id}
												id={subcategory.id}
												name={subcategory.name}
												image={subcategory.image}
												onPress={() => handleSubcategoryPress(subcategory.id)}
											/>
										))}
							</View>
						</View>
					</ScrollView>
				) : (
					<View style={{ flex: 1 }}>
						<FlatList
							ref={flatListRef}
							data={allProducts}
							keyExtractor={item => item.id}
							contentContainerStyle={styles.listContainer}
							renderItem={({ item }) => (
								<HorizontalProductCard
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
								/>
							)}
							ListEmptyComponent={() => (
								<View style={{ flex: 1, justifyContent: 'center' }}>
									{productsDataLoading && page === 1 ? (
										<View style={styles.productsGrid}>
											{Array.from({ length: 6 }).map((_, index) => (
												<View
													key={`skeleton-${index}`}
													style={styles.skeletonWrapper}>
													<View style={styles.skeletonCard}>
														<View style={styles.skeletonImage} />
														<View style={styles.skeletonInfo}>
															<View style={styles.skeletonLine} />
															<View style={styles.skeletonLineSmall} />
															<View style={styles.skeletonLineShort} />
														</View>
													</View>
												</View>
											))}
										</View>
									) : (
										!productsDataLoading && (
											<View style={styles.emptyStateContainer}>
												<Animated.View style={{ transform: [{ scale: cartAnim }] }}>
													<IconSymbol
														name='cart.fill'
														size={64}
														color={CustomColors.darkBrown}
													/>
												</Animated.View>
												<Text style={styles.emptyStateText}>No Products Found</Text>
												<Text style={styles.emptyStateSubtext}>Check back later for new items</Text>
												<TouchableOpacity
													style={styles.viewAllButton}
													onPress={() => router.push('/all-categories')}>
													<Text style={styles.viewAllButtonText}>View other products</Text>
												</TouchableOpacity>
											</View>
										)
									)}
								</View>
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
							onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
								useNativeDriver: false,
							})}
							scrollEventThrottle={16}
							showsVerticalScrollIndicator={false}
						/>

						<Animated.View style={[styles.backToTopButton, { opacity: buttonOpacity }]}>
							<TouchableOpacity
								onPress={scrollToTop}
								activeOpacity={0.8}
								style={styles.backToTopInner}>
								<IconSymbol
									name='chevron.up'
									size={24}
									color='#FFF'
								/>
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
		gap: 12,
	},
	productCardWrapper: {
		width: '48%',
		marginBottom: 12,
	},
	skeletonWrapper: {
		marginBottom: 12,
	},
	skeletonCard: {
		flexDirection: 'row',
		backgroundColor: '#FFF',
		borderRadius: 12,
		padding: 12,
		borderWidth: 1,
		borderColor: '#F0F0F0',
	},
	skeletonImage: {
		width: 80,
		height: 80,
		borderRadius: 8,
		backgroundColor: '#E0E0E0',
	},
	skeletonInfo: {
		flex: 1,
		marginLeft: 12,
		justifyContent: 'space-between',
	},
	skeletonLine: {
		height: 16,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
		marginBottom: 8,
		width: '80%',
	},
	skeletonLineSmall: {
		height: 12,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
		marginBottom: 8,
		width: '50%',
	},
	skeletonLineShort: {
		height: 14,
		backgroundColor: '#E0E0E0',
		borderRadius: 4,
		width: '40%',
	},
	emptyStateContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
	},
	emptyStateText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: CustomColors.darkBrown,
		marginTop: 8,
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: CustomColors.darkBrown,
		opacity: 0.8,
		marginTop: 4,
	},
	viewAllButton: {
		marginTop: 20,
		paddingVertical: 12,
		paddingHorizontal: 24,
		backgroundColor: CustomColors.darkBrown,
		borderRadius: 8,
	},
	viewAllButtonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: '600',
	},
	listContainer: {
		padding: 16,
		flexGrow: 1,
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
