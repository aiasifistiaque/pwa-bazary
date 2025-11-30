import { CategoryCard } from '@/components/category-card';
import CategorySkeleton from '@/components/category-skeleton/CategorySkeleton';
import { Loader } from '@/components/Loader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function AllCategoriesScreen() {
	const { data: categoryData, isLoading } = useGetAllQuery({
		path: '/categorys',
		limit: 200,
		sort: '-priority',
	});

	const parentCategories = categoryData?.doc?.filter(
		(category: any) => !category.parentCategory
	);

	console.log('categoryData', categoryData);
	console.log('parentCategories', parentCategories);
	const handleBack = () => {
		router.back();
	};

	const handleCategoryPress = (categoryId: string) => {
		router.push(`/category/${categoryId}`);
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<View style={styles.container}>
					<SafeAreaView style={styles.safeArea}>
						{/* Header */}
						<View style={styles.header}>
							<Pressable onPress={handleBack} style={styles.backButton}>
								<IconSymbol name='chevron.left' size={24} color='#000000' />
							</Pressable>
							<Text style={styles.headerTitle}>All Categories</Text>
							<View style={{ width: 40 }} />
						</View>
					</SafeAreaView>

					<ScrollView
						style={styles.scrollView}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.categoriesGrid}>
							{parentCategories?.map((category: any) => (
								<CategoryCard
									key={category.id}
									{...category}
									onPress={() => handleCategoryPress(category.id)}
								/>
							))}
						</View>
					</ScrollView>
				</View>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	safeArea: {
		backgroundColor: '#FFFFFF',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	backButton: {
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000',
	},
	scrollView: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	categoriesGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 12,
		justifyContent: 'space-between',
	},
});
