import { ProductCard } from '@/components/product-card';
import { ProductCardSkeleton } from '@/components/skeleton/ProductCardSkeleton';
import { SubCategorySkeleton } from '@/components/skeleton/SubCategorySkeleton';
import { SubCategoryCard } from '@/components/SubCategoryCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery, useGetByIdQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router, useLocalSearchParams } from 'expo-router';

import React from 'react';
import {
	Image,
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

	const { data: productsData, isLoading: productsDataLoading } = useGetAllQuery(
		{
			path: 'products',
			filters: {
				category_in: id,
			},
		}
	);

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
			})
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
						activeOpacity={0.7}
					>
						<IconSymbol name='chevron.left' size={24} color='#000' />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>{catName?.name}</Text>
					<View style={styles.headerSpacer} />
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}
				>
					{/* Subcategories */}
					{hasSubcategories ? (
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
					) : (
						<View style={styles.section}>
							<View style={styles.productsGrid}>
								{productsDataLoading ? (
									Array.from({ length: 6 }).map((_, index) => (
										<View
											key={`skeleton-${index}`}
											style={styles.productCardWrapper}
										>
											<ProductCardSkeleton />
										</View>
									))
								) : productsData?.doc?.length > 0 ? (
									productsData?.doc?.map((product: any) => (
										<View key={product.id} style={styles.productCardWrapper}>
											<ProductCard
												id={product.id}
												name={product.name}
												price={product.price}
												unit={product.unit}
												unitPrice={product.unitPrice}
												badge={product.badge}
												badgeIcon={product.badgeIcon}
												image={product.image}
												onPress={() => handleProductPress(product.id)}
												onAddPress={() => handleAddPress(product)}
											/>
										</View>
									))
								) : (
									<View style={styles.emptyStateContainer}>
										<IconSymbol name='cart.fill' size={64} color='#8B4513' />
										<Text style={styles.emptyStateText}>No Products Found</Text>
										<Text style={styles.emptyStateSubtext}>
											Check back later for new items
										</Text>
									</View>
								)}
							</View>
						</View>
					)}
				</ScrollView>
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
});
