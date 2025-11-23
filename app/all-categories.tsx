import { CategoryCard } from '@/components/category-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const allCategories = [
	{
		id: 'cat1',
		name: 'Fruits & Vegetables',
		image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&h=200&fit=crop',
	},
	{
		id: 'cat2',
		name: 'Dairy & Eggs',
		image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop',
	},
	{
		id: 'cat3',
		name: 'Bakery',
		image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
	},
	{
		id: 'cat4',
		name: 'Meat & Fish',
		image: 'https://images.unsplash.com/photo-1588347818036-8f9af5d47c1a?w=200&h=200&fit=crop',
	},
	{
		id: 'cat5',
		name: 'Beverages',
		image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop',
	},
	{
		id: 'cat6',
		name: 'Snacks',
		image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=200&h=200&fit=crop',
	},
	{
		id: 'cat7',
		name: 'Frozen',
		image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
	},
	{
		id: 'cat8',
		name: 'Household',
		image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=200&h=200&fit=crop',
	},
	{
		id: 'cat9',
		name: 'Personal Care',
		image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop',
	},
	{
		id: 'cat10',
		name: 'Baby Products',
		image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop',
	},
	{
		id: 'cat11',
		name: 'Pet Supplies',
		image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop',
	},
	{
		id: 'cat12',
		name: 'Breakfast & Cereal',
		image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop',
	},
];

export default function AllCategoriesScreen() {
	const handleBack = () => {
		router.back();
	};

	const handleCategoryPress = (categoryId: string) => {
		router.push(`/category/${categoryId}`);
	};

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				{/* Header */}
				<View style={styles.header}>
					<Pressable
						onPress={handleBack}
						style={styles.backButton}>
						<IconSymbol
							name='chevron.left'
							size={24}
							color='#000000'
						/>
					</Pressable>
					<Text style={styles.headerTitle}>All Categories</Text>
					<View style={{ width: 40 }} />
				</View>
			</SafeAreaView>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}>
				<View style={styles.categoriesGrid}>
					{allCategories.map(category => (
						<CategoryCard
							key={category.id}
							{...category}
							onPress={() => handleCategoryPress(category.id)}
						/>
					))}
				</View>
			</ScrollView>
		</View>
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
