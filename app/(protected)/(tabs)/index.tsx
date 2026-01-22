import { BannerCarousel } from '@/components/banner-carousel';
import { CategoryCard } from '@/components/category-card';
import { FeaturedCategorySection } from '@/components/featured-category-section';
import { SectionHeader } from '@/components/section-header';
import CategorySkeleton from '@/components/skeleton/CategorySkeleton';
import RecipeCardSkeleton from '@/components/skeleton/RecipeCardSkeleton';
import { IOSInstallPrompt } from '@/components/IOSInstallPrompt';
import { CustomColors } from '@/constants/theme';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import React from 'react';
import {
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function DiscoverScreen() {
	// data fetching
	const { data: categoryData, isLoading } = useGetAllQuery({
		path: '/categorys',
		sort: '-priority',
		filters: { displayInHomePage: true, isActive: true },
	}) as any;

	const { data: featuredCategoriesData } = useGetAllQuery({
		path: '/categorys',
		sort: '-priority',
		filters: { isFeatured: true, isActive: true },
	}) as any;

	const { data: combosData, isLoading: combosLoading } = useGetAllQuery({
		path: '/combos',
		filters: { isFeatured: true },
	}) as any;

	const { data: bannersData, isLoading: bannersLoading } = useGetAllQuery({
		path: '/banners',
		filters: { isActive: true },
	}) as any;

	const handleBannerPress = (link: string) => {
		router.push(link as any);
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
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			{/* iOS Install Prompt Banner */}
			<IOSInstallPrompt />
			
			{/* Banner Carousel */}
			<BannerCarousel
				banners={bannersData?.doc}
				onBannerPress={handleBannerPress}
				isLoading={bannersLoading}
			/>

			{/* Categories Section */}
			<View style={styles.categoriesSection}>
				{isLoading ? (
					<View style={styles.sectionHeaderSkeleton} />
				) : (
					<SectionHeader title='Categories' />
				)}
				{isLoading ? (
					<View style={styles.categoriesGrid}>
						{Array.from({ length: 8 }).map((_, i) => (
							<CategorySkeleton key={i} />
						))}
					</View>
				) : (
					<View style={styles.categoriesGrid}>
						{categoryData?.doc?.slice(0, 8).map((category: any) => (
							<CategoryCard
								key={category.id}
								{...category}
								onPress={() => handleCategoryPress(category.id)}
							/>
						))}
					</View>
				)}
				{isLoading ? (
					<View style={styles.showMoreButtonSkeleton} />
				) : (
					<TouchableOpacity
						style={styles.showMoreButton}
						onPress={handleShowMoreCategories}
						activeOpacity={0.7}
					>
						<Text style={styles.showMoreText}>Show more categories</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Recipe Combos Section */}
			<View style={styles.section}>
				{combosLoading ? (
					<View style={styles.sectionHeaderSkeleton} />
				) : (
					<SectionHeader title='Combo Recipes' />
				)}
				{combosLoading ? (
					<FlatList
						horizontal
						data={Array.from({ length: 3 })}
						renderItem={({ index }) => <RecipeCardSkeleton key={index} />}
						keyExtractor={(_, index) => `skeleton-${index}`}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.recipeList}
					/>
				) : (
					<FlatList
						horizontal
						data={combosData?.doc}
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
										{item.shortDescription}
									</Text>
								</View>
							</TouchableOpacity>
						)}
						keyExtractor={item => item.id}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.recipeList}
					/>
				)}
			</View>

			{/* Featured Product Sections */}
			{featuredCategoriesData?.doc?.map((category: any) => (
				<FeaturedCategorySection key={category.id} category={category} />
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		paddingTop: 4,
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
		color: CustomColors.darkGreen,
	},
	section: {
		marginBottom: 16,
		backgroundColor: '#FFFFFF',
		paddingVertical: 8,
	},
	productList: {
		paddingHorizontal: 16,
		gap: 12,
		paddingVertical: 8,
	},
	recipeList: {
		paddingHorizontal: 16,
		flexDirection: 'row',
		flexWrap: 'wrap',
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
	sectionHeaderSkeleton: {
		height: 24,
		width: 120,
		backgroundColor: '#F0F0F0',
		borderRadius: 4,
		marginLeft: 16,
		marginVertical: 12,
	},
	showMoreButtonSkeleton: {
		marginHorizontal: 16,
		marginTop: 12,
		height: 48,
		backgroundColor: '#F0F0F0',
		borderRadius: 8,
	},
});
