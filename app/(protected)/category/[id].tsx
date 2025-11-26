import { FavoriteProductCard } from '@/components/favorite-product-card';
import { Loader } from '@/components/Loader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery, useGetByIdQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router, useLocalSearchParams } from 'expo-router';

import React from 'react';
import {
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
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
	const hasSubcategories = childCategories?.doc?.length > 0;
	const { data: productsData, isLoading: productsDataLoading } = useGetAllQuery(
		{
			path: 'products',
			filters: {
				category_in: id,
				// isActive: true,
				// status: 'published',
			},
		}
	);

	// const categoryData = getCategoryData(id || 'fruit');

	const handleBack = () => {
		router.back();
	};

	const handleSubcategoryPress = (subcategoryId: string) => {
		router.push(`/category/${subcategoryId}`);
	};

	const handleProductPress = (productId: string) => {
		// console.log('dffs', router);
		// console.log('Pressed productId:', productId);
		// router.push('/product/123');
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
	// childCatLoading
	if (childCatLoading || productsDataLoading) {
		return <Loader />;
	}
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
					{/* {isCatNameLoading ? (
						<View style={styles.container}>
							<ActivityIndicator />
						</View>
					) : (
						<Text style={styles.headerTitle}>{catName?.name}</Text>
					)} */}
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
								{childCategories?.doc?.map((subcategory: any) => (
									<TouchableOpacity
										key={subcategory.id}
										style={styles.subcategoryCard}
										onPress={() => handleSubcategoryPress(subcategory.id)}
										activeOpacity={0.7}
									>
										{subcategory.image ? (
											<Image
												source={{ uri: subcategory.image }}
												style={styles.subcategoryImage}
											/>
										) : (
											<Image
												source={fallback}
												style={styles.subcategoryImage}
											/>
										)}
										<Text style={styles.subcategoryName}>
											{subcategory.name}
										</Text>
										<IconSymbol name='chevron.right' size={20} color='#333' />
									</TouchableOpacity>
								))}
							</View>
						</View>
					) : (
						<View style={styles.section}>
							<View style={styles.productsGrid}>
								{productsData?.doc?.length > 0 ? (
									productsData?.doc?.map((product: any) => (
										<FavoriteProductCard
											key={product.id}
											{...product}
											onPress={() => handleProductPress(product.id)}
											onAddPress={() => handleAddPress(product)}
										/>
									))
								) : (
									<Text>No products found</Text>
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
});

{
	/* Products */
}
// {!categoryData.hasSubcategories && categoryData.products && (
// 	<View style={styles.section}>
// 		<View style={styles.productsGrid}>
// 			{categoryData.products.map((product: any) => (
// 				<FavoriteProductCard
// 					key={product.id}
// 					{...product}
// 					onPress={() => handleProductPress(product.id)}
// 					onAddPress={() => handleAddPress(product)}
// 				/>
// 			))}
// 		</View>
// 	</View>
// )}
