import CategorySkeleton from '@/components/category-skeleton/CategorySkeleton';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGetAllQuery } from '@/store/services/commonApi';
import { router } from 'expo-router';
import {
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
const fallbackImage = require('../../assets/images/fallback-fruit.png')
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
	const { data: categoryData, isLoading } = useGetAllQuery({
		path: '/categorys',
		filters: { displayInHomePage: true },
	});
	const handleCategoryPress = (categoryId: string) => {
		router.push(`/category/${categoryId}`);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				{/* Search Bar */}
				<View style={styles.searchContainer}>
					<IconSymbol name='magnifyingglass' size={20} color='#666' />
					<TextInput
						style={styles.searchInput}
						placeholder='Search for products or recipes'
						placeholderTextColor='#999'
					/>
				</View>

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
					{isLoading ? (
						<View>
							{Array.from({ length: 3 }).map((_, index) => (
								<CategorySkeleton key={index} />
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
});
