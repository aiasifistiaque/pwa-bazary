import { FavoriteProductCard } from '@/components/favorite-product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
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

// Mock data for categories and their products
const getCategoryData = (id: string) => {
	const categories: Record<string, any> = {
		cat1: {
			id: 'cat1',
			name: 'Fruits & Vegetables',
			hasSubcategories: true,
			subcategories: [
				{
					id: 'fruits',
					name: 'Fruits',
					image:
						'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop',
				},
				{
					id: 'vegetables',
					name: 'Vegetables',
					image:
						'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop',
				},
				{
					id: 'organic',
					name: 'Organic Produce',
					image:
						'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&h=200&fit=crop',
				},
			],
		},
		fruits: {
			id: 'fruits',
			name: 'Fruits',
			hasSubcategories: true,
			subcategories: [
				{
					id: 'apples',
					name: 'Apples',
					image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop',
				},
				{
					id: 'bananas',
					name: 'Bananas',
					image:
						'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&h=200&fit=crop',
				},
				{
					id: 'berries',
					name: 'Berries',
					image:
						'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
				},
				{
					id: 'citrus',
					name: 'Citrus Fruits',
					image:
						'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=200&h=200&fit=crop',
				},
			],
		},
		vegetables: {
			id: 'vegetables',
			name: 'Vegetables',
			hasSubcategories: false,
			products: [
				{
					id: 'v1',
					name: 'Fresh Tomatoes',
					category: 'Vegetables',
					price: '148',
					unit: '500g',
					unitPrice: '৳297/kg',
					image: 'https://images.unsplash.com/photo-1546470427-227c3f7f6984?w=400&h=400&fit=crop',
				},
				{
					id: 'v2',
					name: 'Carrots',
					category: 'Vegetables',
					price: '115',
					unit: '500g',
					unitPrice: '৳229/kg',
					image:
						'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
				},
				{
					id: 'v3',
					name: 'Broccoli',
					category: 'Vegetables',
					price: '172',
					unit: '500g',
					unitPrice: '৳344/kg',
					image:
						'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop',
				},
				{
					id: 'v4',
					name: 'Spinach',
					category: 'Vegetables',
					price: '148',
					unit: '250g',
					unitPrice: '৳594/kg',
					image:
						'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
				},
			],
		},
		fruit: {
			id: 'fruit',
			name: 'Fruit',
			hasSubcategories: true,
			subcategories: [
				{
					id: 'apples',
					name: 'Apples',
					image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop',
				},
				{
					id: 'bananas',
					name: 'Bananas',
					image:
						'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200&h=200&fit=crop',
				},
				{
					id: 'berries',
					name: 'Berries',
					image:
						'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop',
				},
				{
					id: 'citrus',
					name: 'Citrus Fruits',
					image:
						'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=200&h=200&fit=crop',
				},
			],
		},
		apples: {
			id: 'apples',
			name: 'Apples',
			hasSubcategories: false,
			products: [
				{
					id: '1',
					name: 'Bio Apfel Pink Lady',
					category: 'Sweet-sour',
					price: '367',
					originalPrice: '459',
					unit: '550g',
					unitPrice: '৳667/kg',
					discount: '20% Off',
					image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
				},
				{
					id: '2',
					name: 'Bio Apfel Elstar',
					category: 'Sweet-sour',
					price: '344',
					unit: '1kg',
					unitPrice: '৳344/kg',
					image:
						'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',
				},
				{
					id: '3',
					name: 'Green Apples',
					category: 'Sour',
					price: '286',
					originalPrice: '344',
					unit: '1kg',
					unitPrice: '৳286/kg',
					discount: '15% Off',
					image:
						'https://images.unsplash.com/photo-1619546952812-adaa0e78e449?w=400&h=400&fit=crop',
				},
				{
					id: '4',
					name: 'Red Delicious',
					category: 'Sweet',
					price: '401',
					unit: '1kg',
					unitPrice: '৳401/kg',
					image:
						'https://images.unsplash.com/photo-1589217157232-464b505b197f?w=400&h=400&fit=crop',
				},
			],
		},
	};

	return (
		categories[id] || {
			id,
			name: 'Category',
			hasSubcategories: false,
			products: [],
		}
	);
};

export default function CategoryScreen() {
	const dispatch = useDispatch();
	const { id } = useLocalSearchParams<{ id: string }>();
	const categoryData = getCategoryData(id || 'fruit');

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
					price: parseFloat(product.price.replace(',', '')),
					image: product.image,
					vat: 0,
				},
				qty: 1,
			})
		);
	};

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
					<Text style={styles.headerTitle}>{categoryData.name}</Text>
					<View style={styles.headerSpacer} />
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}>
					{/* Subcategories */}
					{categoryData.hasSubcategories && (
						<View style={styles.section}>
							<View style={styles.categoriesGrid}>
								{categoryData.subcategories?.map((subcategory: any) => (
									<TouchableOpacity
										key={subcategory.id}
										style={styles.subcategoryCard}
										onPress={() => handleSubcategoryPress(subcategory.id)}
										activeOpacity={0.7}>
										<Image
											source={{ uri: subcategory.image }}
											style={styles.subcategoryImage}
										/>
										<Text style={styles.subcategoryName}>{subcategory.name}</Text>
										<IconSymbol
											name='chevron.right'
											size={20}
											color='#333'
										/>
									</TouchableOpacity>
								))}
							</View>
						</View>
					)}

					{/* Products */}
					{!categoryData.hasSubcategories && categoryData.products && (
						<View style={styles.section}>
							<View style={styles.productsGrid}>
								{categoryData.products.map((product: any) => (
									<FavoriteProductCard
										key={product.id}
										{...product}
										onPress={() => handleProductPress(product.id)}
										onAddPress={() => handleAddPress(product)}
									/>
								))}
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
