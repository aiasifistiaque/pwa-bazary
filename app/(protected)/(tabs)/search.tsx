import SearchCategorySkeleton from '@/components/skeleton/SearchCategorySkeleton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { ProductCard } from '@/components/product-card';
import { Loader } from '@/components/Loader';
const fallbackImage = require('../../../assets/images/fallback-fruit.png');
// Featured categories for "This Week"
const thisWeekCategories = [
	{
		id: 'offers',
		name: 'All Offers',
		icon: '🏷️',
		color: '#FFF9C4',
	},
	{
		id: 'new',
		name: 'New in App',
		icon: '✨',
		color: '#F8BBD0',
	},
	{
		id: 'recipes',
		name: 'All Recipes',
		icon: '🍳',
		color: '#C8E6C9',
	},
];

// Main categories

export default function SearchScreen() {
	const dispatch = useDispatch();
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	const { data: categoryData, isLoading: isCategoryLoading } = useGetAllQuery({
		path: '/categorys',
		filters: { displayInHomePage: true },
	});

	const { data: searchResults, isLoading: isSearchLoading } = useGetAllQuery(
		{
			path: 'products',
			search: debouncedQuery,
		},
		{ skip: !debouncedQuery }
	);

	const handleCategoryPress = (categoryId: string) => {
		router.push(`/category/${categoryId}`);
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

	return (
		<View style={styles.safeArea}>
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* Search Bar */}
				<View style={styles.searchContainer}>
					<IconSymbol name='magnifyingglass' size={20} color='#666' />
					<TextInput
						style={styles.searchInput}
						placeholder='Search for products or recipes'
						placeholderTextColor='#999'
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
					{searchQuery.length > 0 && (
						<TouchableOpacity onPress={() => setSearchQuery('')}>
							<IconSymbol name='xmark.circle.fill' size={20} color='#999' />
						</TouchableOpacity>
					)}
				</View>

				{debouncedQuery ? (
					// Search Results View
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>
							Search Results for "{debouncedQuery}"
						</Text>
						{isSearchLoading ? (
							<Loader />
						) : (
							<View style={styles.productsGrid}>
								{searchResults?.doc?.length > 0 ? (
									searchResults.doc.map((product: any) => (
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
										<IconSymbol name='magnifyingglass' size={64} color='#ccc' />
										<Text style={styles.emptyStateText}>No products found</Text>
										<Text style={styles.emptyStateSubtext}>
											Try searching for something else
										</Text>
									</View>
								)}
							</View>
						)}
					</View>
				) : (
					// Default View
					<>
						{/* This Week Section */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>This Week</Text>
							<View style={styles.thisWeekGrid}>
								{thisWeekCategories.map(category => (
									<TouchableOpacity
										key={category.id}
										style={[
											styles.thisWeekCard,
											{ backgroundColor: category.color },
										]}
										onPress={() => handleCategoryPress(category.id)}
										activeOpacity={0.7}
									>
										<Text style={styles.thisWeekIcon}>{category.icon}</Text>
										<Text style={styles.thisWeekName}>{category.name}</Text>
										<IconSymbol name='chevron.right' size={20} color='#333' />
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* All Categories Section */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>All Categories</Text>
							{isCategoryLoading ? (
								<View>
									{Array.from({ length: 8 }).map((_, index) => (
										<SearchCategorySkeleton key={index} />
									))}
								</View>
							) : (
								<View style={styles.categoriesGrid}>
									{categoryData?.doc?.map((category: any) => (
										<TouchableOpacity
											key={category.id}
											style={styles.categoryCard}
											onPress={() => handleCategoryPress(category.id)}
											activeOpacity={0.7}
										>
											{category.image ? (
												<Image
													source={{ uri: category.image }}
													style={styles.categoryImage}
												/>
											) : (
												<Image
													source={fallbackImage}
													style={styles.categoryImage}
												/>
											)}
											<Text style={styles.categoryName}>{category.name}</Text>
											<IconSymbol name='chevron.right' size={20} color='#333' />
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>
					</>
				)}
			</ScrollView>
		</View>
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
	searchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F5F5F5',
		margin: 16,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 12,
		gap: 12,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: '#333',
	},
	section: {
		paddingHorizontal: 16,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000',
		marginBottom: 16,
	},
	thisWeekGrid: {
		gap: 12,
	},
	thisWeekCard: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 12,
		gap: 12,
	},
	thisWeekIcon: {
		fontSize: 32,
	},
	thisWeekName: {
		flex: 1,
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	categoriesGrid: {
		gap: 12,
	},
	categoryCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FAFAFA',
		padding: 12,
		borderRadius: 12,
		gap: 12,
	},
	categoryImage: {
		width: 60,
		height: 60,
		borderRadius: 8,
	},
	categoryName: {
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
		paddingVertical: 40,
		gap: 12,
	},
	emptyStateText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#666',
	},
	emptyStateSubtext: {
		fontSize: 14,
		color: '#999',
	},
});
