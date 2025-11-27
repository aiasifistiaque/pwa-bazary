import { BannerCarousel } from '@/components/banner-carousel';
import { CategoryCard } from '@/components/category-card';
import CategorySkeleton from '@/components/category-skeleton/CategorySkeleton';
import { DeliveryTimeButton } from '@/components/delivery-time-button';
import { ProductCard } from '@/components/product-card';
import { SectionHeader } from '@/components/section-header';
import { useGetAllQuery } from '@/store/services/commonApi';
import { addToCart } from '@/store/slices/cartSlice';
import { router } from 'expo-router';
import React from 'react';
import {
	FlatList,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useDispatch } from 'react-redux';

// Banner data
const banners = [
	{
		id: 'banner1',
		title: 'Welcome to bazarey!',
		subtitle: 'Extra for you: 25 € benefit',
		couponCode: 'NEUKUNDE',
		image:
			'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&h=400&fit=crop',
	},
	{
		id: 'banner2',
		title: 'Fresh Daily Deals',
		subtitle: 'Save up to 30% on fresh produce',
		image:
			'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=400&fit=crop',
	},
	{
		id: 'banner3',
		title: 'Free Delivery',
		subtitle: 'On orders over 50 €',
		image:
			'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
	},
];

// Recipe combos data
const recipeCombos = [
	{
		id: 'recipe1',
		name: 'Khichuri Recipe',
		image:
			'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop',
		description: 'Traditional Bengali comfort food',
	},
	{
		id: 'recipe2',
		name: 'Teheri Recipe',
		image:
			'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
		description: 'Flavorful rice dish with spices',
	},
	{
		id: 'recipe3',
		name: 'Biryani Recipe',
		image:
			'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
		description: 'Aromatic rice with meat and spices',
	},
	{
		id: 'recipe4',
		name: 'Polao Recipe',
		image:
			'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop',
		description: 'Fragrant basmati rice dish',
	},
];

const FeaturedCategorySection = ({ category }: { category: any }) => {
	const dispatch = useDispatch();
	const { data: productsData, isLoading } = useGetAllQuery({
		path: '/products',
		filters: { category: category.id },
	});

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
					price: product.sellPrice,
					image: product.image,
					vat: 0,
				},
				qty: 1,
			})
		);
	};

	const handleSeeAllPress = () => {
		router.push(`/category/${category.id}`);
	};

	if (isLoading || !productsData?.doc?.length) return null;

	return (
		<View style={styles.section}>
			<SectionHeader title={category.name} onSeeAllPress={handleSeeAllPress} />
			<FlatList
				horizontal
				data={productsData.doc}
				renderItem={({ item }) => (
					<ProductCard
						id={item.id}
						name={item.name}
						price={item.sellPrice.toString()}
						image={item.image}
						unit={item.unit}
						unitPrice={item.unitPrice} // Assuming backend sends this or it's calculated
						onPress={() => handleProductPress(item.id)}
						onAddPress={() => handleAddPress(item)}
					/>
				)}
				keyExtractor={item => item.id}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.productList}
			/>
		</View>
	);
};

export default function DiscoverScreen() {
	// data fetching
	const { data: categoryData, isLoading } = useGetAllQuery({
		path: '/categorys',
		filters: { displayInHomePage: true },
	});

	const { data: featuredCategoriesData } = useGetAllQuery({
		path: '/categorys',
		filters: { isFeatured: true },
	});

	const handleDeliveryTimePress = () => {
		console.log('Delivery time pressed');
	};

	const handleBannerPress = (bannerId: string) => {
		console.log('Banner pressed:', bannerId);
	};

	const handleCategoryPress = (categoryId: string) => {
		router.push(`/category/${categoryId}`);
	};

	const handleShowMoreCategories = () => {
		router.push('/all-categories');
	};

	const handleRecipePress = (recipeId: string) => {
		router.push(`/recipe/${recipeId}`);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* Delivery Time Selector */}
				<DeliveryTimeButton
					text='Choose your delivery time'
					onPress={handleDeliveryTimePress}
				/>

				{/* Banner Carousel */}
				<BannerCarousel banners={banners} onBannerPress={handleBannerPress} />

				{/* Categories Section */}
				<View style={styles.categoriesSection}>
					<SectionHeader title='Categories' />
					{isLoading ? (
						<View style={styles.categoriesGrid}>
							{Array.from({ length: 4 }).map((_, i) => (
								<CategorySkeleton key={i} />
							))}
						</View>
					) : (
						<View style={styles.categoriesGrid}>
							{categoryData?.doc?.map((category: any) => (
								<CategoryCard
									key={category.id}
									{...category}
									onPress={() => handleCategoryPress(category.id)}
								/>
							))}
						</View>
					)}

					<TouchableOpacity
						style={styles.showMoreButton}
						onPress={handleShowMoreCategories}
						activeOpacity={0.7}
					>
						<Text style={styles.showMoreText}>Show more categories</Text>
					</TouchableOpacity>
				</View>

				{/* Recipe Combos Section */}
				<View style={styles.section}>
					<SectionHeader title='Combo Recipes' />
					<FlatList
						horizontal
						data={recipeCombos}
						renderItem={({ item }) => (
							<TouchableOpacity
								style={styles.recipeCard}
								onPress={() => handleRecipePress(item.id)}
								activeOpacity={0.8}
							>
								<Image
									source={{ uri: item.image }}
									style={styles.recipeImage}
								/>
								<View style={styles.recipeInfo}>
									<Text style={styles.recipeName}>{item.name}</Text>
									<Text style={styles.recipeDescription}>
										{item.description}
									</Text>
								</View>
							</TouchableOpacity>
						)}
						keyExtractor={item => item.id}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.recipeList}
					/>
				</View>

				{/* Featured Product Sections */}
				{featuredCategoriesData?.doc?.map((category: any) => (
					<FeaturedCategorySection key={category.id} category={category} />
				))}
			</ScrollView>
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
	categoriesSection: {
		marginBottom: 16,
		paddingVertical: 8,
	},
	categoriesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 16,
		justifyContent: 'space-between',
	},
	showMoreButton: {
		marginHorizontal: 16,
		marginTop: 8,
		paddingVertical: 12,
		backgroundColor: '#F8F8F8',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		alignItems: 'center',
	},
	showMoreText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#E63946',
	},
	section: {
		marginBottom: 16,
		backgroundColor: '#FFFFFF',
		paddingVertical: 8,
	},
	productList: {
		paddingHorizontal: 16,
	},
	recipeList: {
		paddingHorizontal: 16,
	},
	recipeCard: {
		width: 280,
		marginRight: 12,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5E5',
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	recipeImage: {
		width: '100%',
		height: 160,
		resizeMode: 'cover',
	},
	recipeInfo: {
		padding: 12,
	},
	recipeName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#000000',
		marginBottom: 4,
	},
	recipeDescription: {
		fontSize: 13,
		color: '#666666',
	},
});
