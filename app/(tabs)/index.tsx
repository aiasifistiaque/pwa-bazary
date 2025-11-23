import { BannerCarousel } from '@/components/banner-carousel';
import { CategoryCard } from '@/components/category-card';
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

const categories = [
	{
		id: 'cat1',
		name: 'Fruits & Vegetables',
		icon: 'leaf.fill',
		image:
			'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop',
	},
	{
		id: 'cat2',
		name: 'Dairy & Eggs',
		icon: 'cup.and.saucer.fill',
		image:
			'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
	},
	{
		id: 'cat3',
		name: 'Bakery',
		icon: 'birthday.cake.fill',
		image:
			'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
	},
	{
		id: 'cat4',
		name: 'Meat & Fish',
		icon: 'fish.fill',
		image:
			'https://images.unsplash.com/photo-1588347818036-8f9af5d47c1a?w=200&h=200&fit=crop',
	},
	{
		id: 'cat5',
		name: 'Beverages',
		icon: 'cup.and.saucer',
		image:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop',
	},
	{
		id: 'cat6',
		name: 'Snacks',
		icon: 'bag.fill',
		image:
			'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop',
	},
	{
		id: 'cat7',
		name: 'Frozen',
		icon: 'snowflake',
		image:
			'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
	},
	{
		id: 'cat8',
		name: 'Household',
		icon: 'house.fill',
		image:
			'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=200&h=200&fit=crop',
	},
];

// Mock product data with more realistic grocery items
const newInAppProducts = [
	{
		id: '1',
		name: 'Pepsi Lemon Zero',
		price: '1,028',
		unit: '6 × 1,25L',
		unitPrice: '৳137/L',
		badge: 'New',
		badgeIcon: 'sparkles',
		image:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
	},
	{
		id: '2',
		name: 'Pineapple Slices in Juice',
		price: '206',
		unit: 'XL 340g',
		unitPrice: '৳605/kg',
		badge: 'New · Own juice',
		badgeIcon: 'sparkles',
		image:
			'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop',
	},
	{
		id: '3',
		name: 'Fresh Orange Juice',
		price: '401',
		unit: '1L',
		unitPrice: '৳401/L',
		badge: 'New',
		badgeIcon: 'sparkles',
		image:
			'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
	},
	{
		id: '4',
		name: 'Organic Bananas',
		price: '263',
		unit: '1kg',
		unitPrice: '৳263/kg',
		image:
			'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop',
	},
];

const popularProducts = [
	{
		id: '5',
		name: 'Whole Milk',
		price: '171',
		unit: '1L',
		unitPrice: '৳171/L',
		image:
			'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
	},
	{
		id: '6',
		name: 'Fresh Bread',
		price: '344',
		unit: '500g',
		unitPrice: '৳688/kg',
		image:
			'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
	},
	{
		id: '7',
		name: 'Eggs Free Range',
		price: '436',
		unit: '10 pieces',
		unitPrice: '৳44/piece',
		image:
			'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
	},
	{
		id: '8',
		name: 'Greek Yogurt',
		price: '229',
		unit: '500g',
		unitPrice: '৳458/kg',
		image:
			'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
	},
];

const freshProduceProducts = [
	{
		id: '9',
		name: 'Fresh Tomatoes',
		price: '286',
		unit: '500g',
		unitPrice: '৳573/kg',
		image:
			'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop',
	},
	{
		id: '10',
		name: 'Green Lettuce',
		price: '148',
		unit: '1 piece',
		unitPrice: '৳148/piece',
		image:
			'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop',
	},
	{
		id: '11',
		name: 'Red Apples',
		price: '401',
		unit: '1kg',
		unitPrice: '৳401/kg',
		image:
			'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
	},
	{
		id: '12',
		name: 'Baby Carrots',
		price: '217',
		unit: '500g',
		unitPrice: '৳435/kg',
		image:
			'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
	},
];

const beverageProducts = [
	{
		id: '13',
		name: 'Coca Cola Zero',
		price: '919',
		unit: '6 × 1,5L',
		unitPrice: '৳102/L',
		image:
			'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
	},
	{
		id: '14',
		name: 'Sparkling Water',
		price: '286',
		unit: '6 × 1,5L',
		unitPrice: '৳32/L',
		image:
			'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
	},
	{
		id: '15',
		name: 'Apple Juice',
		price: '344',
		unit: '1L',
		unitPrice: '৳344/L',
		image:
			'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
	},
	{
		id: '16',
		name: 'Green Tea',
		price: '401',
		unit: '20 bags',
		unitPrice: '৳20/bag',
		image:
			'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop',
	},
];

const specialOffersProducts = [
	{
		id: '17',
		name: 'Pasta Penne',
		price: '148',
		unit: '500g',
		unitPrice: '৳297/kg',
		badge: 'Sale',
		badgeIcon: 'tag.fill',
		image:
			'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
	},
	{
		id: '18',
		name: 'Olive Oil Extra Virgin',
		price: '804',
		unit: '500ml',
		unitPrice: '৳1,608/L',
		badge: 'Sale',
		badgeIcon: 'tag.fill',
		image:
			'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
	},
	{
		id: '19',
		name: 'Chocolate Bar Dark',
		price: '286',
		unit: '100g',
		unitPrice: '৳2,864/kg',
		badge: 'Sale',
		badgeIcon: 'tag.fill',
		image:
			'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop',
	},
	{
		id: '20',
		name: 'Coffee Beans',
		price: '1,034',
		unit: '500g',
		unitPrice: '৳2,068/kg',
		badge: 'Sale',
		badgeIcon: 'tag.fill',
		image:
			'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
	},
];

const sections = [
	{ id: 'section1', title: 'New in the App', products: newInAppProducts },
	{ id: 'section2', title: 'Popular Products', products: popularProducts },
	{ id: 'section3', title: 'Fresh Produce', products: freshProduceProducts },
	{ id: 'section4', title: 'Beverages', products: beverageProducts },
	{ id: 'section5', title: 'Special Offers', products: specialOffersProducts },
];

export default function DiscoverScreen() {
	// data fetching
	const { data: categoryData, isLoading } = useGetAllQuery({
		path: '/categorys',
	});
	console.log('cat dat:', categoryData);
	const dispatch = useDispatch();

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

	const handleSeeAllPress = (sectionTitle: string) => {
		router.push({
			pathname: '/product-list',
			params: { category: sectionTitle },
		});
	};

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
					<View style={styles.categoriesGrid}>
						{categories?.map(category => (
							<CategoryCard
								key={category.id}
								{...category}
								onPress={() => handleCategoryPress(category.id)}
							/>
						))}
					</View>
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

				{/* Product Sections */}
				{sections.map((section, index) => (
					<View key={section.id} style={styles.section}>
						<SectionHeader
							title={section.title}
							onSeeAllPress={() => handleSeeAllPress(section.title)}
						/>
						<FlatList
							horizontal
							data={section.products}
							renderItem={({ item }) => (
								<ProductCard
									{...item}
									onPress={() => handleProductPress(item.id)}
									onAddPress={() => handleAddPress(item)}
								/>
							)}
							keyExtractor={item => item.id}
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={styles.productList}
						/>
					</View>
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
