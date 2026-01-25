import { BannerCarousel } from '@/components/banner-carousel';
import { CategoryCard } from '@/components/category-card';
import { FeaturedCategorySection } from '@/components/featured-category-section';
import { RecipeCard } from '@/components/recipe-card';
import { SectionHeader } from '@/components/section-header';
import CategorySkeleton from '@/components/skeleton/CategorySkeleton';
import RecipeCardSkeleton from '@/components/skeleton/RecipeCardSkeleton';
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
		sort: '-priority',
		filters: { isFeatured: true, isActive: true },
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
					<SectionHeader
						title='Combo Recipes'
						onSeeAllPress={() => router.push('/recipes')}
					/>
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
						data={combosData?.doc?.slice(0, 5)}
						renderItem={({ item }) => (
							<RecipeCard
								key={item.id}
								{...item}
								onPress={handleRecipePress}
								style={styles.recipeCard}
							/>
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
		gap: 12,
	},
	recipeCard: {
		width: 280,
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
