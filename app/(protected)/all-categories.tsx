import { CategoryCard } from '@/components/category-card';
import CustomHeader from '@/components/header/CustomHeader';
import CategorySkeleton from '@/components/skeleton/CategorySkeleton';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllCategoriesScreen() {
	const { data: categoryData, isLoading } = useGetAllQuery({
		path: '/categorys',
		limit: 200,
		sort: '-priority',
	});

	const parentCategories = categoryData?.doc?.filter((category: any) => !category.parentCategory);

	const handleCategoryPress = (categoryId: string) => {
		router.push(`/category/${categoryId}`);
	};

	return (
		<>
			<SafeAreaView style={styles.container}>
				<View style={styles.safeArea}>
					{/* Header */}
					<CustomHeader>
						All Categories {categoryData && `(${parentCategories?.length})`}
					</CustomHeader>
					{/* <View style={styles.header}>
						<Pressable onPress={handleBack} style={styles.backButton}>
							<IconSymbol name='chevron.left' size={24} color='#000000' />
						</Pressable>
						<Text style={styles.headerTitle}>All Categories</Text>
						<View style={{ width: 40 }} />
					</View> */}
				</View>

				<ScrollView
					style={styles.scrollView}
					showsVerticalScrollIndicator={false}>
					<View style={styles.categoriesGrid}>
						{isLoading
							? Array.from({ length: 20 }).map((_, index) => (
									<CategorySkeleton key={`skeleton-${index}`} />
								))
							: parentCategories?.map((category: any) => (
									<CategoryCard
										key={category.id}
										{...category}
										onPress={() => handleCategoryPress(category.id)}
									/>
								))}
					</View>
				</ScrollView>
			</SafeAreaView>
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
		marginTop: 12,
		// justifyContent: 'space-between',
		justifyContent: 'flex-start',
		gap: 10,
	},
});
